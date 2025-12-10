import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector } from '../../services/store';
import { userSelectors } from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store';
import { updateUser } from '../../services/thunks/userThunk';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(userSelectors.userSelect);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await dispatch(
        updateUser({
          name: formValue.name,
          email: formValue.email
        })
      ).unwrap();
      // Очищаем пароль после успешного обновления
      setFormValue((prev) => ({ ...prev, password: '' }));
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log('Update error:', err.message);
      } else if (typeof err === 'string') {
        console.log('Update error:', err);
      } else {
        console.log('Update error: Unknown error');
      }
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
