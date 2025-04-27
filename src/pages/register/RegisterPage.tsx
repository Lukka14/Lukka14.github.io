import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Cookies from "js-cookie";
import {
  fetchDiscoverMovies,
  fetchMe,
  fetchOnlyMovies,
} from "../../services/MediaService";
import { Media } from "../../models/Movie";
import { Background } from "../main/Background";
import PrimarySearchAppBar from "../shared/TopNavBar";
import "./RegisterPage.css";
import { Endpoints } from "../../config/Config";
import { useNavigate } from "react-router-dom";

const schema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
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
      const user = await fetchMe();
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

      const res = await axios.post(Endpoints.LOGIN, {
        username: data.username,
        password: data.password,
      });

      const { accessToken } = res.data;

      Cookies.set("accessToken", accessToken.token, {
        expires: new Date(Date.now() + accessToken.expiresIn),
        secure: true,
        sameSite: "Strict",
      });

      // Cookies.set("refreshToken", refreshToken.token, {
      //     expires: new Date(Date.now() + refreshToken.expiresIn),
      //     secure: true,
      //     sameSite: "Strict",
      // });

      Cookies.set("username", data.username, {
        expires: new Date(Date.now() + accessToken.expiresIn),
        secure: true,
        sameSite: "Strict",
      });

      reset();
      window.location.href = "/#/profile/" + data.username;
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Registration failed. Please try again."
      );
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
            className="btn btn-outline-primary w-100"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          {/* idk */}
          {/* <div className="text-center mt-3">
                        Already have an account? <a href="/login">Login</a>
                    </div> */}
        </form>
      </div>
    </>
  );
}
