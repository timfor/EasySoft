import jwt from "jsonwebtoken";
import { getUserById } from('../controllers/usersController'); // Предположим, что у вас есть функция для получения пользователя по ID
import dotenv from "dotenv";

dotenv.config();
const jwt_key = process.env.jwt;


const refreshBearerToken = async (req, res, next) => {
  try {
    // Проверяем, есть ли в запросе токен
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }

    // Извлекаем токен из заголовка
    const token = authHeader.split(' ')[1];
    
    // Проверяем токен на валидность
    jwt.verify(token, jwt_key, async (err, decodedToken) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      } else {
        // Получаем пользователя по ID из токена
        const user = await getUserById(decodedToken.userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        
        // Генерируем новый токен
        const newToken = jwt.sign({ userId: user.user_id }, jwt_key, { expiresIn: '1h' });

        // Добавляем новый токен в заголовок ответа
        res.setHeader('Authorization', `Bearer ${newToken}`);

        // Продолжаем выполнение запроса
        next();
      }
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = refreshBearerToken;
