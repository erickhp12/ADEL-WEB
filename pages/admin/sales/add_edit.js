import Layout from "../../../components/layouts/Layout";
import Router from "next/router";

import Form from "../../../components/form/Form";
import { addSale, getSale, updateSale } from "../../../services/sales"
import { getBranchOffices } from '../../../services/branch_offices'
import { getAssociates } from "../../../services/associates"


export default class extends React.Component {

    static async getInitialProps({ query }) {
        let id = query.id;
        let title = "";
        id ? (title = "Editar venta") : (title = "Agregar venta");
        return { id, title };
    }

    state = {
      associates: [],
      branch_offices: [],
      data: {
        items:[{
          sale_type:'package',
          qty:1,
          product_name: 'Nombre del paquete',
          patient_package:1,
          unit_price:'1500.00'
        }]
      },
        errors: {}
    };

    async componentDidMount() {

      // TRAE SUCURSALES
      try {
        const req = await getBranchOffices()
        const data = req.data

        let branch_offices = data.map(obj =>{
            return { label: obj.name, value: obj.id }
        })

        branch_offices.unshift({
            label:'Seleccionar...', value:'' 
        })

        this.setState({ branch_offices })

      } catch (error) {
          console.log(error)
      }

      // TRAE ASOCIADOS
      try {
          const req = await getAssociates();
          const data = req.data;

          let associates = data.map(obj => {
              return { label: obj.first_name + " " + obj.last_name, value: obj.id };
          });

          associates.unshift({
              label: "Seleccionar...",
              value: ""
          });

          this.setState({ associates });

        } catch (error) {
          console.log(error);
      }

  }


  render() {
    const { id, title } = this.props;

    const breadcrumb = [
      { name: "ADEL", url: "admin", active: false },
      { name: "Ventas", url: "sales", active: false },
      { name: title, url: "", active: true }
    ];

    var form = {
      button: {
        label: "Guardar",
        onSubmit: async (event, values) => {
          if (id) {
            try {
                await updateSale(id, values);
                Router.pushRoute("sales");
            } catch (error) {
                const errors = error.response.data
                this.setState({ errors })
            }
          } else {
            try {
                await addSale(values);
                Router.pushRoute("sales");
            } catch (error) {
              const errors = error.response.data
              this.setState({ errors })
            }
          }
        }
      },
      fields: [
        {
          name:'branch_office',
          label:'Sucursal',
          type:'select',
          helpText:'',
          options: this.state.branch_offices
        },
        {
          name: "total",
          label: "Total",
          type: "text",
          helpText: ""
        },
        {
          name: "vendors",
          label: "Asociado",
          type: "select-multiple",
          helpText: "",
          options: this.state.associates
        }
      ],
      data: this.state.data,
      errors: this.state.errors
    };

    return (
      <Layout title={title} selectedMenu="sales" breadcrumb={breadcrumb}>
        <div className="card">
          <div className="card-content">
            <h4 className="subtitle is-4">{title}</h4>
            <Form
              buttonLabel={form.button.label}
              onSubmit={form.button.onSubmit}
              fields={form.fields}
              data={form.data}
              errors={form.errors}
            />
          </div>
        </div>
        <style jsx>
          {`
            
          `}
        </style>
      </Layout>
    );
  }
}