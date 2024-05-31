import React from "react";
import { useForm } from "react-hook-form";

const Register = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    alert(JSON.stringify(data));
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Email:
          <input
            {...register("email", {
              required: "Поле не должно быть пустым",
            })}
          />
        </label>
        <div style={{ height: 40 }}>
          {errors?.email && <p>{errors?.email?.message || "Error idk"}</p>}
        </div>
        {/* <label>
          Password:
          <input {...register("email")} />
        </label> */}
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

export default Register;
