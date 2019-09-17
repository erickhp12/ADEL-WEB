import auth from '../services/auth'
import { Component } from 'react'
import Router from 'next/router'

export default class extends Component{
    state = {
        email: '',
        password: '',
        errors: {}
    }

    handleInputChange = (e) => {
        const el = e.target;
        const value = el.value;
        const name = el.name;
        this.setState({
            [name]: value,
            errores: {}
        });
    }

    logIn = () => {
        const credentials = {
            email: this.state.email,
            password: this.state.password
        }

        auth.login(credentials)
        .then(resp => {
            if (!resp.error)
                Router.pushRoute('admin')
            else
                this.setState({ errors: resp.errors })
        })
        .catch(e => {
            this.setState({ errors: e.message })
        })
        this.setState({ email: '', password: '' })
        document.getElementById("txtEmail").focus()
    }

    componentWillMount () {
        if (auth.logged()) Router.pushRoute('admin')
    }

    render(){
      return (
        <div className="page">
          <div className="card">
              <div className="card-content">
                <div className="formulario">
                    <p>INICIO DE SESION</p>
                    <label>CORREO ELECTRONICO</label>
                    <input
                        type="email"
                        id="txtEmail"
                        name="email"
                        value={ this.state.email }
                        onChange={ this.handleInputChange }
                    />
                    <label>CONTRASEÑA</label>
                    <input
                        type="password"
                        name="password"
                        value={ this.state.password }
                        onChange={ this.handleInputChange }
                    />
                <button className="btnLogin" onClick={ this.logIn }>ENTRAR</button>
                </div>
            </div>
        </div>
    
            <style jsx>{`
                    .page{
                        background: linear-gradient(45deg,  rgba(66, 183, 245,0.8) 0%,rgba(66, 245, 189,0.4) 100%);
                        color: $gray;
                        font-family: $base-font-family;
                        font-size: $base-font-size;
                        line-height: $base-line-height;
                        -webkit-font-smoothing: antialiased;
                        -moz-osx-font-smoothing: grayscale;
                        width: 100%;
                        height: 1000px;
                        position: absolute;
                        margin-top: -10px;
                        margin-left: -10px;
                    }
                    .card{
                        box-shadow: 1px 1px 5px #c5c5c5;
                        width: 35%;
                        height: 20rem;
                        margin: 0 auto;
                        margin-top: 12%;
                        padding: 2rem;
                        background:white;
                    }
                    p{
                        color: #4285F4;
                        font-family: sans-serif;
                        font-weight: 600;
                        font-size: 24px;
                    }
                    label{
                        display: block;
                        margin: 0 0 10px;
                        color: gray;
                        font-size: 12px;
                        font-weight: 500;
                        line-height: 1;
                        text-transform: uppercase;
                        letter-spacing: .2em;
                    }
                    .formulario{
                        margin-left: 5%;
                        font-family: sans-serif;
                    }
                    input{
                        margin-top:10px;
                        margin-bottom:20px;
                        font-size:20px;
                        outline: none;
                        display: block;
                        background: #e8e8e8;
                        width: 90%;
                        border: 0;
                        border-radius: 4px;
                        box-sizing: border-box;
                        padding: 12px 20px;
                        color: gray;
                        font-family: inherit;
                        font-size: inherit;
                        font-weight: 500; 
                        line-height: inherit;
                        transition: 0.3s ease;
                    }
                    .btnLogin{
                        color: white;
                        background: #4285F4;
                        font-weight: 500;
                        font-size: 18px;
                        border-radius: 4px;
                        padding: 8px;
                        width: 90%;
                        margin-top: 1rem;
                    }
            `}</style>
      </div>
      )
    }
  }