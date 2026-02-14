import { createContext, useEffect, useState, useMemo } from "react";

export const CartContext = createContext();

const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.id || user?._id || null;
  } catch {
    return null;
  }
};

export const CartProvider = ({ children }) => {
  const [userId, setUserId] = useState(getUserId());

  const cartKey = userId ? `cart_${userId}` : "cart_guest";

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem(cartKey)) || [];
  });

  // 🔄 Track login/logout
  useEffect(() => {
    const interval = setInterval(() => {
      setUserId(getUserId());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // 🔄 Reload cart on user change
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCart(stored);
  }, [cartKey]);

  // 💾 Persist cart
  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, cartKey]);

  // ➕ ADD TO CART (SAFE IMAGE HANDLING)
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find(
        (item) => item._id === product._id
      );

      if (exists) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      // 🖼️ Normalize image
      let imageUrl = "";

      if (typeof product.image === "string") {
        imageUrl = product.image;
      } else if (Array.isArray(product.image)) {
        imageUrl = product.image[0];
      } else if (
        product.image &&
        typeof product.image === "object"
      ) {
        imageUrl = product.image.url;
      }

      if (imageUrl && !imageUrl.startsWith("http")) {
        imageUrl = `http://localhost:5000/${imageUrl}`;
      }

      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          category: product.category,
          qty: 1,
          image: imageUrl || "https://via.placeholder.com/100",
        },
      ];
    });
  };

  // 🔁 UPDATE QUANTITY  ✅ (THIS WAS MISSING)
  const updateQty = (id, type) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              qty:
                type === "inc"
                  ? item.qty + 1
                  : Math.max(1, item.qty - 1),
            }
          : item
      )
    );
  };

  // ❌ REMOVE ITEM
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  };

  // 🧹 CLEAR CART
  const clearCart = () => setCart([]);

  // 🧮 TOTALS
  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      ),
    [cart]
  );

  const shipping = cart.length > 0 ? 50 : 0;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        subtotal,
        shipping,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

