// src/routes/postRouter.ts
import { Router } from "express";
import { prisma } from "../prisma.js";

const router = Router();

// 1. Создать новый пост с тегами (Связь Многие-ко-многим)
router.post("/", async (req, res) => {
  const { title, content, authorId, tags } = req.body; // tags — это массив строк, например ["typescript", "backend"]

  if (!title || !authorId) {
    res.status(400).json({ error: "Поля title и authorId обязательны" });
    return;
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
        // Магия Prisma для связи многие-ко-многим (Tag <-> Post):
        // connectOrCreate найдет тег, если он есть, или создаст новый, если его нет
        tags: tags && Array.isArray(tags) ? {
          connectOrCreate: tags.map((tagName: string) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        } : undefined,
      },
      // Указываем Prisma вернуть созданный пост сразу вместе с его тегами
      include: {
        tags: true,
      },
    });

    res.status(201).json(newPost);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});




// 2. Получить все публикации конкретного тега
router.get("/tag/:tagName", async (req, res) => {
  const { tagName } = req.params;

  try {
    const postsWithTag = await prisma.post.findMany({
      where: {
        tags: {
          some: { name: tagName } // Фильтр: найти посты, у которых есть ХОТЯ БЫ ОДИН такой тег
        }
      },
      include: {
        author: {
          select: { name: true, email: true } // Выбираем только определенные поля автора
        },
        tags: true
      }
    });

    res.json(postsWithTag);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;