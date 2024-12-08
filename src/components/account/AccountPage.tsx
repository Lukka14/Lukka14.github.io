import React from "react";
import { useParams } from "react-router-dom";
import { Background } from "../main/Background";

const AccountPage: React.FC = () => {
  const { username } = useParams<{ username: string }>(); // Extract the username from the route

  return (
    <>
     <Background
    url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true"
    />

    <div className="account-page">
        <div className="avatar">
            <img src="https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2526512481.jpg" alt="Default Avatar" />
        </div>
        <div className="account-details">
            <h2>{username}</h2>
        </div>
    </div>
    </>
  )
};

export default AccountPage;
