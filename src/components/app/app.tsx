import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import styles from './app.module.css';

import {
  AppHeader,
  Modal,
  OrderInfo,
  IngredientDetails
} from '@components';
import { Preloader } from '@ui';
import { OnlyAuth, OnlyUnAuth } from '../protected-route/protected-route';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { checkUserAuth } from '../../services/slices/userSlice';

const App = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const background = location.state?.background;

  const { ingredients, isLoading, error } = useAppSelector(
    (state) => state.ingredients
  );

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      {isLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : ingredients.length > 0 ? (
        <>
          <Routes location={background || location}>
            <Route path="/" element={<ConstructorPage />} />
            <Route path="/feed" element={<Feed />} />

            <Route path="/login" element={<OnlyUnAuth component={<Login />} />} />
            <Route path="/register" element={<OnlyUnAuth component={<Register />} />} />
            <Route path="/forgot-password" element={<OnlyUnAuth component={<ForgotPassword />} />} />
            <Route path="/reset-password" element={<OnlyUnAuth component={<ResetPassword />} />} />

            <Route path="/profile" element={<OnlyAuth component={<Profile />} />} />
            <Route path="/profile/orders" element={<OnlyAuth component={<ProfileOrders />} />} />

            <Route
              path="/ingredients/:id"
              element={
                <div className={styles.detailPageWrap}>
                  <IngredientDetails />
                </div>
              }
            />
            <Route
              path="/feed/:number"
              element={
                <div className={styles.detailPageWrap}>
                  <OrderInfo />
                </div>
              }
            />
            <Route
              path="/profile/orders/:number"
              element={
                <OnlyAuth
                  component={
                    <div className={styles.detailPageWrap}>
                      <OrderInfo />
                    </div>
                  }
                />
              }
            />

            <Route path="*" element={<NotFound404 />} />
          </Routes>

          {background && (
            <Routes>
              <Route
                path="/ingredients/:id"
                element={
                  <Modal title="Детали ингредиента" onClose={handleModalClose}>
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path="/feed/:number"
                element={
                  <Modal title="" onClose={handleModalClose}>
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route
                path="/profile/orders/:number"
                element={
                  <OnlyAuth
                    component={
                      <Modal title="" onClose={handleModalClose}>
                        <OrderInfo />
                      </Modal>
                    }
                  />
                }
              />
            </Routes>
          )}
        </>
      ) : (
        <div className={`${styles.title} text text_type_main-medium pt-4`}>
          Нет ингредиентов
        </div>
      )}
    </div>
  );
};

export default App;