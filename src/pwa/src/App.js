import React, { useEffect } from 'react';
import PrivateRoute from './components/PrivateRoute';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import RestaurantsView from './components/Restaurants/RestaurantsView';
import OrdersView from './components/Orders/OrdersView';
import HelpView from './components/Help/HelpView';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import RestaurantView from './components/Restaurant/RestaurantView';
import CartView from './components/Cart/CartView';
import { messaging } from "./firebase";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <CartProvider>
        <Switch>
          <PrivateRoute exact path='/' component={RestaurantsView} />
          <Route path='/signup' component={Signup} />
          <Route path='/login' component={Login} />
          <PrivateRoute path='/ordenes' component={OrdersView} />
          <PrivateRoute path='/ayuda' component={HelpView} />
          <PrivateRoute path='/carrito' component={CartView} />
          <Route path='/restaurant/:name' render={routerProps => <RestaurantView routerProps={routerProps} />} />
        </Switch>
      </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
