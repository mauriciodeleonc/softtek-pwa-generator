import React, { useContext, useState, useEffect } from 'react'
import { auth, db } from '../firebase';
import firebase from 'firebase/app';
import { useAuth } from './AuthContext';

export const CartContext = React.createContext();

export function useCart() {
    return useContext(CartContext)
}
export function CartProvider({ children }) {
    const [cart, setCart] = useState();
    const [loading, setLoading] = useState(true)
    const { currentUser } = useAuth();

    async function getTotalItems() {
        //gets number total items in cart
        let numItems = 0;
        const updatedCart = await getCart();
        return updatedCart.noProducts
    }

    function getRestaurantTotal(cartRestaurant) {
        //calculate restaurant total cost
        let restaurantTotal = 0;
        cartRestaurant.products.forEach(product => {
            restaurantTotal += product.cantidad * product.costoUnitario
        })
        return restaurantTotal
    }

    function getRestaurantNoProducts(cartRestaurant) {
        //calculate restaurant total number of products
        let restaurantNoProducts = 0;
        cartRestaurant.products.forEach(product => {
            restaurantNoProducts += product.cantidad
        })
        return restaurantNoProducts
    }

    function getCartTotalWaitingTime(cartWaitingTime) {
        //calculate cart's total waiting time
        let totalWaitingTime = 0;
        cartWaitingTime.restaurantes.forEach(restaurant => {
            totalWaitingTime += restaurant.waitingTime;
        })
        return totalWaitingTime
    }

    function getRestaurantAverageWaitingTime(restaurant) {
        //calculate restaurant's average waiting time
        const sumTiemposEntrega = restaurant.products.reduce((a, b) => a + b.tiempoEntrega, 0);
        const avgTiempoEntrega = (sumTiemposEntrega / restaurant.products.length) || 0;
        return avgTiempoEntrega
    }

    async function addProduct(input_product, input_restaurant, addedOfProduct, instructions) {
        //check if product is already in cart
        const filteredRestaurant = cart.restaurantes.find(restaurant => restaurant.restaurantId === input_restaurant.id)
        const filteredProduct = filteredRestaurant ? filteredRestaurant.products.find(product => product.id === input_product.id) : undefined;
        if (filteredProduct != undefined) {
            await incrementProduct(input_product.id, input_restaurant.name, addedOfProduct, filteredProduct.costoUnitario, filteredProduct.tiempoEntregaUnitario, instructions)
        } else if (filteredRestaurant) {
            //add new product from existing restaurant to cart
            filteredRestaurant.products.push({
                cantidad: addedOfProduct,
                comentario: instructions,
                costoTotal: addedOfProduct * input_product.price,
                costoUnitario: input_product.price,
                descripcion: input_product.description,
                id: input_product.id,
                nombre: input_product.name,
                tiempoEntrega: input_product.estimatedTime,
                tiempoEntregaUnitario: input_product.estimatedTime
            })
            filteredRestaurant.total += Number(input_product.price)
            filteredRestaurant.waitingTime = getRestaurantAverageWaitingTime(filteredRestaurant)
            filteredRestaurant.noProducts = getRestaurantNoProducts(filteredRestaurant)

            cart.noProducts += addedOfProduct;
            cart.total = cart.total + addedOfProduct * Number(input_product.price);
        } else {
            //add new product from new restaurant to cart
            cart.restaurantes.push({
                paymentType: input_restaurant.paymentTypes,
                products: [{
                    cantidad: addedOfProduct,
                    comentario: instructions,
                    costoTotal: addedOfProduct * input_product.price,
                    costoUnitario: input_product.price,
                    descripcion: input_product.description,
                    id: input_product.id,
                    nombre: input_product.name,
                    tiempoEntrega: input_product.estimatedTime * addedOfProduct,
                    tiempoEntregaUnitario: input_product.estimatedTime
                }],
                restaurantId: input_restaurant.id,
                restaurantName: input_restaurant.name,
                total: addedOfProduct * input_product.price,
                waitingTime: input_product.estimatedTime * addedOfProduct,
                noProducts: addedOfProduct
            })
            cart.noProducts += addedOfProduct;
            cart.total = cart.total + (addedOfProduct * input_product.price);
        }
        cart.waitingTime = getCartTotalWaitingTime(cart);
        await db.collection('carts').doc(cart.cartId).update(cart);
    }

    async function incrementProduct(productId, restaurantName, addedOfProduct, unitaryPrice, tiempoEntregaUnitario, instructions) {
        const filteredRestaurant = cart.restaurantes.find(restaurant => restaurant.restaurantName === restaurantName);
        const filteredProduct = filteredRestaurant.products.find(product => product.id === productId);
        if(instructions) filteredProduct.comentario = instructions;
        if(addedOfProduct != filteredProduct.cantidad) { //only update when addedOfProduct is different
            const qtyDifference = addedOfProduct - filteredProduct.cantidad
            filteredProduct.cantidad = addedOfProduct;
            filteredProduct.costoTotal = Number(unitaryPrice * addedOfProduct);
            filteredProduct.tiempoEntrega = Number(tiempoEntregaUnitario * addedOfProduct);
            filteredRestaurant.total = getRestaurantTotal(filteredRestaurant)
            filteredRestaurant.waitingTime = getRestaurantAverageWaitingTime(filteredRestaurant)
            filteredRestaurant.noProducts = getRestaurantNoProducts(filteredRestaurant)
  
            cart.noProducts+= qtyDifference;
            cart.total = cart.total + Number(unitaryPrice * qtyDifference);
            cart.waitingTime = getCartTotalWaitingTime(cart);
        }

        await db.collection('carts').doc(cart.cartId).update(cart);
    }

    async function decrementProduct(productId, restaurantName, addedOfProduct, unitaryPrice, tiempoEntregaUnitario) {
        const filteredRestaurant = cart.restaurantes.find(restaurant => restaurant.restaurantName === restaurantName);
        if (addedOfProduct <= 0) {
            //remove from cart
            const cartProductsFromRestaurant = filteredRestaurant.products
            if (cartProductsFromRestaurant.length === 1) {
                //only product from restaurant, delete restaurant from cart
                cart.restaurantes = cart.restaurantes.filter(restaurant => restaurant.restaurantName != restaurantName)
            } else {
                //other products in cart from restaurant, delete product from restaurant in cart
                cart.restaurantes.find(restaurant => restaurant.restaurantName === restaurantName).products = cartProductsFromRestaurant.filter(product => product.id !== productId)
            }
            filteredRestaurant.total = getRestaurantTotal(filteredRestaurant)
        } else {
            //reduce quantity of product in cart
            const filteredProduct = filteredRestaurant.products.find(product => product.id === productId);
            filteredProduct.cantidad = addedOfProduct;
            filteredProduct.costoTotal -= Number(unitaryPrice);
            filteredProduct.tiempoEntrega -= Number(tiempoEntregaUnitario);

            filteredRestaurant.total = getRestaurantTotal(filteredRestaurant)
            filteredRestaurant.waitingTime = getRestaurantAverageWaitingTime(filteredRestaurant)
            filteredRestaurant.noProducts = getRestaurantNoProducts(filteredRestaurant)

        }
        cart.noProducts--;
        cart.total -= unitaryPrice;
        cart.waitingTime = getCartTotalWaitingTime(cart);
        await db.collection('carts').doc(cart.cartId).update(cart);
    }

    async function getCart() {
        //get latest cart data
        const snapshot = await db.collection('carts').where('userId', '==', currentUser.uid).get()
        let cartData;
        snapshot.forEach(cart => {
            cartData = cart.data();
            cartData.cartId = cart.id

        })
        setCart(cartData)
        return cartData
    }

    async function createOrder(location, parkingSpot, phone, name, payment, cashAmount) {
        const finalCart = await getCart();
        finalCart.restaurantes.forEach(async restaurant => {
            const { id } = await db.collection('orders').add({
                cashAmount: cashAmount,
                creationDate: new Date(),
                customerPhone: phone,
                id: null,
                name: name,
                onWay: location === 'En Camino' ? true : false,
                parkingPlace: location === 'En Camino' ? location : parkingSpot,
                paymentType: payment,
                products: restaurant.products,
                restaurantId: restaurant.restaurantId,
                statusId: 1,
                storeName: restaurant.restaurantName,
                total: getRestaurantTotal(restaurant), //ensure total is correct
                userId: cart.userId,
                waitingTime: restaurant.waitingTime
            });

            await db.collection('orders').doc(id).update({
                id: id,
            })
        });
        //reset user's cart to empty
        finalCart.noProducts = 0;
        finalCart.restaurantes = [];
        finalCart.total = 0;
        finalCart.waitingTime = 0;
        await db.collection('carts').doc(finalCart.cartId).update(finalCart);
    }

    useEffect(() => {
        if (!currentUser) {
            setCart({})
            setLoading(false)
            return
        }
        db.collection('carts').where('userId', '==', currentUser.uid).get().then(snapshot => {
            snapshot.forEach(cart => {
                const cartData = cart.data();
                cartData.cartId = cart.id
                setCart(cartData)
                setLoading(false)
            })
        })
    }, [currentUser])

    const value = {
        cart,
        getCart,
        addProduct,
        incrementProduct,
        decrementProduct,
        getTotalItems,
        createOrder,
    }

    return (
        <CartContext.Provider value={value}>
            {!loading && children}
        </CartContext.Provider>
    )
}
