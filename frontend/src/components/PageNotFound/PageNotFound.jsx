import {React} from "react";
import { Link } from "react-router-dom";
import './PageNotFound.css';

export default function PageNotFound () {
    return (
      <section className="not-found">
        <h1 className="not-found__title">{`Oops!\nPage Not Found`}</h1>
        <img className="not-found__image" src={''} alt=""/>
        <Link to="/">
            <button className="not-found__button">
            <p className="not-found__text">Go to the Homepage</p>
            </button>
        </Link>
      </section>
    )
  }