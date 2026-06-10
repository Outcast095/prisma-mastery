// 1. Импортируем инстанс prisma (с маленькой буквы) для выполнения запросов
import { prisma } from "../../../src/prisma.js";

// 2. Импортируем пространство имен Prisma (с большой буквы) для работы с типами и ошибками
import { Prisma } from "../../../src/generated/prisma/client.js";




// =========================================================================
// ПРИМЕР 4: Метод findUniqueOrThrow (Гарантированный поиск по уникальному ключу)
// =========================================================================
// Логика: Работает как findUnique, но если запись отсутствует в базе, он 
// жестко выбрасывает исключение PrismaClientKnownRequestError с кодом 'P2025'.
// Это избавляет от необходимости писать ручные проверки `if (!user)`.

// Пример вызова: const user = await getUserProfile("user-uuid-123")
async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    return user;
  } catch (error: unknown) { 
    // Проверяем, является ли ошибка системным исключением Prisma Client
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Код 'P2025' означает: "An operation failed because it depends on one or more records that were not found"
      if (error.code === 'P2025') {
        console.log(`Запись с ID ${userId} не найдена в таблице User.`);
        return null; // В Express-роуте здесь обычно вызывают res.status(404)
      }
    }

    // Если ошибка непредвиденная (упала сеть/БД) — прокидываем её дальше
    throw error;
  }

  /*
    ========================================================================
    ОЖИДАЕМЫЙ РЕЗУЛЬТАТ ВЫПОЛНЕНИЯ ФУНКЦИИ (JSON):
    ========================================================================
    Если id существует — вернет объект User. Если id нет в базе — сработает catch и вернет null:

    {
      "id": "user-uuid-123",
      "email": "magomed@dev.com",
      "name": "Магомед",
      "role": "USER"
    }
  */
}