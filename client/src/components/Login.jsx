import React from "react";
import { useForm } from "react-hook-form";

const Login = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Email:
          <input {...register("email")} />
        </label>
        <input type="submit" />
      </form>
      {/* <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" name="username" ref={register({ required: 'Username is required' })} />
        {errors.username && <p>{errors.username.message}</p>}
  
        <input type="password" name="password" ref={register({ required: 'Password is required' })} />
        {errors.password && <p>{errors.password.message}</p>}
  
        <button type="submit">Submit</button>
      </form> */}
    </>
  );
};

export default Login;
