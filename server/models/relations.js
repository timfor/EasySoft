import { Good, GoodStatus, Category } from "./goodModel.js";
import { Order, OrderItem, OrderStatus } from "./orderModel.js";
import { User, UserRole } from "./userModel.js";

User.belongsTo(UserRole, { foreignKey: "role_id", as: "role" });
UserRole.hasMany(User, { foreignKey: "role_id", as: "users" });
User.hasMany(Order, { foreignKey: "user_id", as: "orders" });

Order.belongsTo(OrderStatus, {
  foreignKey: "order_status_id",
  as: "order_status",
});
OrderItem.belongsTo(Order, { foreignKey: "order_id", as: "order" });
OrderItem.belongsTo(Good, { foreignKey: "good_id", as: "good" });
Order.belongsTo(User, { foreignKey: "user_id", as: "user" });
Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });

Good.belongsTo(GoodStatus, { foreignKey: "good_status_id", as: "status" });
GoodStatus.hasMany(Good, { foreignKey: "good_status_id", as: "goods" });
Good.belongsTo(Category, { foreignKey: "category_id", as: "category" });
Category.hasMany(Good, { foreignKey: "category_id", as: "goods" });

export {
  Good,
  GoodStatus,
  Category,
  Order,
  OrderItem,
  OrderStatus,
  User,
  UserRole,
};
