import type { Meta } from "@storybook/nextjs-vite";
import CommonInput from "./CommonInput";
import { useForm } from "react-hook-form";

const meta: Meta = {
  title: "Atoms/CommonInput",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

export const Default = () => {
  const { register } = useForm<{ input: string }>();
  return (
    <div style={{ minWidth: "300px" }}>
      <CommonInput id="input" placeholder="Enter text" register={register} />
    </div>
  );
};

export const WithLabel = () => {
  const { register } = useForm<{ input: string }>();
  return (
    <div style={{ minWidth: "300px" }}>
      <CommonInput
        id="input"
        label="Username"
        placeholder="Enter your username"
        register={register}
      />
    </div>
  );
};

export const WithError = () => {
  const { register } = useForm<{ input: string }>();
  return (
    <div style={{ minWidth: "300px" }}>
      <CommonInput
        id="input"
        label="Email"
        placeholder="Enter your email"
        register={register}
        error={{ type: "manual", message: "This field is required" }}
      />
    </div>
  );
};

export const WithSuccess = () => {
  const { register } = useForm<{ input: string }>();
  return (
    <div style={{ minWidth: "300px" }}>
      <CommonInput
        id="input"
        label="Password"
        placeholder="Enter your password"
        register={register}
        success="Password is strong!"
      />
    </div>
  );
};

export const Email = () => {
  const { register } = useForm<{ email: string }>();
  return (
    <div style={{ minWidth: "300px" }}>
      <CommonInput
        id="email"
        type="email"
        label="Email Address"
        placeholder="example@email.com"
        register={register}
      />
    </div>
  );
};

export const Password = () => {
  const { register } = useForm<{ password: string }>();
  return (
    <div style={{ minWidth: "300px" }}>
      <CommonInput
        id="password"
        type="password"
        label="Password"
        placeholder="Enter password"
        register={register}
      />
    </div>
  );
};

export const Number = () => {
  const { register } = useForm<{ age: number }>();
  return (
    <div style={{ minWidth: "300px" }}>
      <CommonInput
        id="age"
        type="number"
        label="Age"
        placeholder="Enter your age"
        register={register}
      />
    </div>
  );
};
