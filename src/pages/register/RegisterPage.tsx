import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  fetchDiscoverMovies,
  fetchOnlyMovies,
} from "../../services/MediaService";
import { Media } from "../../models/Movie";
import { Background } from "../main/Background";
import PrimarySearchAppBar from "../shared/TopNavBar";
import "./RegisterPage.css";
import { Endpoints } from "../../config/Config";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { getCurrentUser } from "../../services/UserService";

const schema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must not exceed 20 characters")
      .regex(
        /^[a-zA-Z0-9._-]+$/,
        "Username can only contain letters, numbers, dots, underscores, and hyphens"
      )
      .refine((val) => val.trim().length > 0, "Username cannot be empty"),

    email: z
      .string()
      .min(1, "Email is required")
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        "Invalid email format"
      )
      .refine((val) => val.trim().length > 0, "Email cannot be empty"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must not exceed 50 characters")
      .regex(
        /^(?=.*[a-zA-Z])[\x00-\x7F]+$/,
        "Password must contain at least one letter"
      )
      .refine((val) => val.trim().length > 0, "Password cannot be empty"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [medias, setMedias] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      const user = await getCurrentUser();
      if (user?.username) navigate("/");
    }
    fetchUser();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setErrorMessage("");
    try {
      await axios.post(Endpoints.REGISTER, {
        username: data.username,
        email: data.email,
        password: data.password,
      });

      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("data-bs-toggle", "modal");
      button.setAttribute("data-bs-target", "#verificationModal");
      button.style.display = "none";

      document.body.appendChild(button);
      button.click();
      document.body.removeChild(button);

      reset();
    } catch (err: any) {
      const response = err.response;
      if (response?.status === 409 && response?.data?.detail) {
        setErrorMessage(response.data.detail);
      } else {
        setErrorMessage(
          response?.data?.message || "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    fetchOnlyMovies(query).then(setMedias).catch(console.error);
  };

  useEffect(() => {
    fetchDiscoverMovies().then(setMedias).catch(console.error);
  }, []);

  return (
    <>
      <Background url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true" />
      <PrimarySearchAppBar onClick={handleSearch} displaySearch={false} />
      <div className="container mt-5 d-flex justify-content-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-100"
          style={{ maxWidth: 400 }}
        >
          <h2 className="mb-4 text-center text-white">Sign Up</h2>
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          <div className="mb-3">
            <label htmlFor="username" className="form-label text-white">
              Username
            </label>
            <input
              {...register("username")}
              id="username"
              className="form-control"
              placeholder="Enter username"
              autoComplete="off"
              disabled={loading}
            />
            {errors.username && (
              <div className="text-danger">{errors.username.message}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-white">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter email"
              autoComplete="off"
              disabled={loading}
            />
            {errors.email && (
              <div className="text-danger">{errors.email.message}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label text-white">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter password"
              autoComplete="off"
              disabled={loading}
            />
            {errors.password && (
              <div className="text-danger">{errors.password.message}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label text-white">
              Confirm Password
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              id="confirmPassword"
              className="form-control"
              placeholder="Repeat password"
              autoComplete="off"
              disabled={loading}
            />
            {errors.confirmPassword && (
              <div className="text-danger">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-outline-primary d-flex align-items-center  justify-content-center w-100"
            disabled={loading}
          >
            {loading && <CircularProgress size={15} style={{
              marginRight: "10px"
            }} />}
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </>
  );
}