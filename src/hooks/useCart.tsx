/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import React from "react";
import type { Cart, CartItem, CartContextType, IdParams } from "../utils/types";
import { cartService } from "../services/cartService";

interface CartProviderProp {
  children: React.ReactNode;
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<CartProviderProp> = ({ children }) => {
  const [cart, setCart] = React.useState<Cart | null>(null);
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [cartTotal, setCartTotal] = React.useState<number>(0);

  const [isAddingToCart, setIsAddingToCart] = React.useState<boolean>(false);
  const [addingProductId, setAddingProductId] = React.useState<number | null>(
    null
  );

  React.useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await cartService.getCart();
      setCart(response.cart);
      setCartTotal(response.total);
      setCartItems(response.cart?.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fetching cart failed");
      // Don't throw here, just set error state
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Enhanced refresh function that uses guest cart with full details
  const refreshCart = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // For better guest experience, use the enhanced method that refreshes product data
      const response = await cartService.getCart();
      setCart(response.cart);
      setCartTotal(response.total);
      setCartItems(response.cart?.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Refreshing cart failed");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addCartItem = React.useCallback(
    async (id: IdParams) => {
      try {
        // Prevent duplicate requests for the same product
        if (addingProductId === id) return false;

        setIsAddingToCart(true);
        setAddingProductId(id);
        setError(null);

        await cartService.addCartItem(id);

        // Refresh the entire cart to get accurate data
        // For guest users, this will now include full product details
        await fetchCart();

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Adding cart item failed";
        setError(errorMessage);
        console.error("Failed to add item to cart:", errorMessage);
        throw err;
      } finally {
        setIsAddingToCart(false);
        setAddingProductId(null);
      }
    },
    [fetchCart, addingProductId]
  );

  const addItemQuantity = async (id: IdParams) => {
    try {
      setIsLoading(true);
      await cartService.addCartItemQuantity(id);
      // const updatedItem = response.item;

      // setCartItems((prevItems) =>
      //   prevItems.map((item) =>
      //     item.id === updatedItem.id ? { ...item, ...updatedItem } : item
      //   )
      // );

      // // Recalculate cart total with updated price
      // setCartTotal((prevTotal) => prevTotal + updatedItem.product.price);
      await fetchCart();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Updating cart item failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const subtractItemQuantity = async (id: IdParams) => {
    try {
      setIsLoading(true);
      await cartService.subtractCartItemQuantity(id);
      // const updatedItem = response.item;

      // setCartItems((prevItems) =>
      //   prevItems.map((item) =>
      //     item.id === updatedItem.id ? { ...item, ...updatedItem } : item
      //   )
      // );

      // // Recalculate cart total with updated price
      // setCartTotal((prevTotal) => prevTotal - updatedItem.product.price);
      await fetchCart();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Updating cart item failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCartItem = async (id: IdParams) => {
    try {
      setIsLoading(true);
      await cartService.deleteCartItem(id);
      // Refresh the entire cart
      await fetchCart();
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Deleting cart item failed"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCart = async () => {
    try {
      const response = await cartService.deleteCart();
      if (response.success === true) {
        setSuccess(true);
      } else {
        setSuccess(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deleting Cart failed");
      throw err;
    }
  };

  const setDeleteSuccess = () => {
    setSuccess(false);
  };

  const value: CartContextType = {
    cart,
    cartItems,
    isLoading,
    isAddingToCart,
    addingProductId,
    error,
    cartTotal,
    success,
    fetchCart,
    refreshCart,
    addCartItem,
    addItemQuantity,
    subtractItemQuantity,
    deleteCart,
    deleteCartItem,
    setDeleteSuccess,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = React.useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart should be used inside the CartProvider");
  }

  return context;
};
