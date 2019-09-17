import auth from '../services/auth'
import { Link } from '../routes'

export default class extends React.Component{

  render(){
    return (
      <div className="container">
        <div className="header">
          <h1>Inicio</h1>
        </div>
        <div className="content">
          <div className="login">
            <Link route="login"><a>Iniciar sesión</a></Link>
          </div>
        </div>
        <style jsx>
        {`
          .header{
            background: #e8e8e8;
            margin-left: -7px;
            margin-top: -22px;
            padding: 0.3rem;
            width: 100%;
            border: 1px solid #cacaca;
          }
          .header>h1{
            font-size:24px;
            font-family: sans-serif;
            font-weight:400;
            text-align:right;
          }
          .login {
            background: #1183afeb;
            width: 6rem;
            padding: 0.5rem;
            border-radius: 4px;
            text-align:center;
            margin-top:10px;
            float:right;
          }
          .login>a{
            -webkit-text-decoration: none;
            text-decoration: none;  
            color: white;
            font-family: sans-serif;
            font-weight:200;
          }
        `}
        </style>
      </div>
    )
  }
}
