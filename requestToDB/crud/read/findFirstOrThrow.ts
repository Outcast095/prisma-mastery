// 1. Импортируем инстанс prisma (с маленькой буквы) для выполнения запросов
import { prisma } from "../../../src/prisma.js";

// 2. Импортируем пространство имен Prisma (с большой буквы) для работы с типами и ошибками
import { Prisma } from "../../../src/generated/prisma/client.js";

// =========================================================================
// ПРИМЕР 5: Метод findFirstOrThrow (Гарантированный поиск первой записи)
// =========================================================================
// Логика: Ищет по любым полям. Если не найдено ни одного совпадения, 
// генерирует ошибку 'P2025'. Идеально для поиска "самого первого/старого" элемента автора.

// Пример вызова: const firstPost = await getFirstAuthorPostOrThrow("user-uuid-123")
async function getFirstAuthorPostOrThrow(authorId: string) {
  try {
    const post = await prisma.post.findFirstOrThrow({
      where: {
        authorId: authorId,
        published: true, 
      },
      orderBy: {
        id: "asc" // Сортировка по возрастанию id, чтобы забрать самую раннюю запись
      }
    });

    return post;
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Код 'P2025' идентичен и для findFirstOrThrow
      if (error.code === 'P2025') {
        console.log(`У автора с ID ${authorId} не найдено ни одного опубликованного поста.`);
        return null;
      }
    }
    throw error;
  }

  /*
    ========================================================================
    ОЖИДАЕМЫЙ РЕЗУЛЬТАТ ВЫПОЛНЕНИЯ ФУНКЦИИ (JSON):
    ========================================================================
    Возвращает самый первый опубликованный объект поста автора:

    {
      "id": "post-uuid-first-1",
      "title": "Приветственный пост",
      "published": true,
      "authorId": "user-uuid-123"
    }
  */
}