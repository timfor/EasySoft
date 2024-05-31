import { UserModel } from "../models/Users.js";
import dotenv from "dotenv";

dotenv.config();
const SQLITEURL = process.env.SQLITEURL;

const userModel = new UserModel(SQLITEURL);

export const getAllUsersController = async (req,res) =>{
    await userModel.getAllUsers((err, row) =>{
        if(err){
            res.status(500).json({message})
        }       
        else{
            res.status(200).json(row)
        } 
    })
}

export const getUserByIdController = async(req,res) =>{
    const user = await userModel.getUserByParameter("user_id", req.params.user_id);

    console.log(user);
  
    if (user.err != null) {
      res.status(500).json({
        message: "Ошибка при получении пользователя по емейлу",
      });
    } else if (user.row != null) {
        res.status(200).json(user)
    } else {
        return res.status(404).json({
            message: "не найдено",
          });
    }
}

export const removeUserController = async(req,res) => { 
    const user = await userModel.getUserByParameter("user_id", req.params.user_id);


    if (user.err != null) {
        res.status(500).json({
          message: "Ошибка при получении пользователя по емейлу",
        });
      } else if (user.row != null) {
        await userModel.deleteUser(req.params.user_id,async (err,row) =>{
            if(err){
                res.status(500).json({
                    message: "Ошибка при получении пользователя по емейлу",
                  });
            }
            else{
                const user = await userModel.getUserByParameter("user_id", req.params.user_id);
   
                if (user.err != null) {
                    res.status(500).json({
                      message: "Ошибка при получении",
                    });
                  } else if (user.row == null) {
                      res.status(200).json({success:true, message:"Успешно удалено"})
                  } else {
                      return res.status(404).json({
                          message: "не найдено",
                        });
                  }
            }
        })
      } else {
          return res.status(404).json({
              message: "не найдено",
            });
      }



}


export const updateUserController = async(req,res) =>{
  const user = await userModel.getUserByParameter("user_id", req.params.user_id);

  
  if (user.err != null) {
    res.status(500).json({
      message: "Ошибка при получении пользователя по емейлу",
    });
  } else if (user.row == null) {
    return res.status(404).json({
      message: "не найдено",
    });
  } 


  const columns = Object.keys(req.body);
  const values = Object.values(req.body);

  let placeholders = columns.map((column) => `${column} = ?`).join(", ");
  const isSuccess = await userModel.updateUserById(
    values,
    placeholders,
    req.params.user_id
  );


  if (isSuccess.row != null) {
    res.status(200).json({ success: true });
  } else if (isSuccess.err != null) {
    res.status(500).json({ success: false, message: err });
  } else {
    res.status(500).json({
      success: false,
      message: "Товар не найден роу не пришел??",
    });
  }


}