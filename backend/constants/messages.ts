export const MSG = {
    NO_TOKEN: "token is not available",
    INVALID_TOKEN: "invalid token",
    INVALID_CREDENTIALS: "invalid credentials",
    FORBIDDEN: "access denied",
    INVALID_QUANTITY: "invalid quantity",
    CHECKOUT_SUCCESS: "checkout successful",
    OTP_CREATED: "otp generated successfully",
    INVALID_OTP : "Invalid OTP",
    OTP_EXPIRED: "otp expired",
    ORDER_PLACED: "order placed successfully",
    ADMIN:{
        INVALID_ROLE: "invalid role, only admins are allowed",
        CREATED: "admin created successfully",
        EXISTS: "admin already exists"
    },
    USER:{
        NOT_FOUND: "User not found",
        EXISTS: "User exists",
        LOGIN: "user login success",
        FETCHED: "user details fetched successfully",
        CREATED: "User created successfully"
    },
    ITEM:{
        CREATED: "item created successfully",
        FETCHED: "items fetched successfully",
        UPDATED: "item updated successfully",
        DELETED: "item deleted successfully",
        OUT_OF_STOCK: "item is out of stock",
        NOT_ENOUGH_STOCK: "not enough stock",
        NOT_FOUND: "item not found",
        CORRUPTED: "item stock corrupted"
    },
    CART:{
        ADDED: "item added to cart",
        REMOVED: "item removed from cart",
        EXISTS: "item already in the cart",
        FETCHED:"Cart items fetched successfully",
        QUANTITY_UPDATED: 'quantity updated successfully',
        NOT_FOUND: "cart not found",
        NOT_IN_CART: "item not in cart",
        EMPTY: "cart is empty",
        INVALID: "invalid cart item",
        INVALID_QUANTITY: "invalid quantity in cart",
        MULTI_CATEGORY_NOT_ALLOWED: "multiple categories not allowed"
    },
    CATEGORY:{
        FETCHED: "category data fetched successfully",
        CREATED: "category created successfully",
        NOT_FOUND: "category not found",
        TIME_OVER: "Ordering time for this category is over",
        ITEM_NOT_FOUND: "Item not in this category",
        ITEM_REMOVED: 'item removed from the category',
        NOT_AVAILABLE: "No categories available today",
        ADDED: "item added to category successfully",
        ITEM_EXISTS: "item already in the category",
        EXISTS: "category already exists",
        DELETED: "category deleted successfully"
    },
    WALLET:{
        NOT_FOUND: "wallet not found",
        INVALID_AMOUNT: "invalid amount",
        MONEY_ADDED: "money added successfully",
        CREDIT_LIMIT_CROSSED: "Credit limit exceeded. Max allowed pending is ₹500",
        FETCHED: "wallet details fetched successfully"
    },
    MENU:{
        FETCHED: "menu fetched successfully",
        NOT_AVAILABLE: "No menu available for today"
    },
    ANALYTICS:{
        ITEM_ANALYTICS: "Item analytics fetched successfully",
        USER_ANALYTICS: "User analytics fetched successfully",
        ORDER_ANALYTICS: "Order analytics fetched successfully",
        REVENUE_ANALYTICS: "Revenue analytics fetched successfully",
        INVALID_TYPE: "Invalid analytics type",
        DATA_NOT_FOUND: "No data found",
        INVALID_FORMAT: "Invalid format. Use ?format=pdf or ?format=excel"
    }
}
