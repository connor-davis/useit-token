import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import CreateUser from "./components/user/CreateUser";
import UpdateUser from "./components/user/UpdateUser";
import ScanUser from "./components/user/ScanUser";
import UsersDB from "./usersdb";
import ProductsDB from "./productsdb";
import UserList from "./components/user/UserList";
import Manage from "./components/Manage";
import CreateProduct from "./components/product/CreateProduct";
import UpdateProduct from "./components/product/UpdateProduct";
import ProductList from "./components/product/ProductList";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      usersdb: new UsersDB(),
      productsdb: new ProductsDB(),
      users: {},
      products: {}
    }

    this.handleCreateUser = this.handleCreateUser.bind(this);
    this.handleUpdateUser = this.handleUpdateUser.bind(this);
    this.handleCreateProduct = this.handleCreateProduct.bind(this);
    this.handleUpdateProduct = this.handleUpdateProduct.bind(this);
    this.handleDeleteProduct = this.handleDeleteProduct.bind(this);
  }

  async componentDidMount() {
    const users = await this.state.usersdb.getUsers();
    const products = await this.state.productsdb.getProducts();

    this.setState({
      users,
      products
    });
  }

  async handleCreateUser(user) {
    let { id } = await this.state.usersdb.newUser(user);

    const { users } = this.state;

    this.setState({
      users: {
        ...users,
        [id]: user
      }
    });

    return id;
  }

  async handleCreateProduct(product) {
    let { id } = await this.state.productsdb.newProduct(product);

    const { products } = this.state;

    this.setState({
      products: {
        ...products,
        [id]: product
      }
    });

    return id;
  }

  async handleUpdateUser(user) {
    let { id } = await this.state.usersdb.updateUser(user);

    const { users } = this.state;

    this.setState({
      users: {
        ...users,
        [id]: user
      }
    });

    return id;
  }

  async handleUpdateProduct(product) {
    let { id } = await this.state.productsdb.updateProduct(product);

    const { products } = this.state;

    this.setState({
      products: {
        ...products,
        [id]: product,
      }
    });

    return id;
  }

  async handleDeleteProduct(productName) {
    const products = Object.values(await this.state.productsdb.getProducts());

    const product = products.filter(p => p.productName === productName)[0];

    let { id } = await this.state.productsdb.deleteProduct(product);

    const productsNew = await this.state.productsdb.getProducts();

    this.setState({
      products: productsNew
    });

    return id;
  }

  render() {
    return (
      <Router>
        <div className="d-app">
          <div className="d-toolbar">
            <Link to="/" className="d-toolbar-title">Use-It Token</Link>
          </div>
          <div className="d-content">
            <Switch>
              <Route exact path="/createUser" component={props => <CreateUser {...props} onCreate={this.handleCreateUser} />} />
              <Route exact path="/updateUser" component={props => <UpdateUser {...props} users={this.state.users} products={this.state.products} onUpdate={this.handleUpdateUser} />} />
              <Route exact path="/scanUser" component={props => <ScanUser {...props} users={this.state.users} />} />
              <Route exact path="/userList" component={props => <UserList {...props} users={this.state.users} />} />

              <Route exact path="/createProduct" component={props => <CreateProduct {...props} onCreate={this.handleCreateProduct} />} />
              <Route path="/updateProduct/:name" component={props => <UpdateProduct {...props} products={this.state.products} onUpdate={this.handleUpdateProduct} />} />
              <Route exact path="/updateProduct" component={props => <UpdateProduct {...props} products={this.state.products} onUpdate={this.handleUpdateProduct} />} />
              <Route exact path="/productList" component={props => <ProductList {...props} products={this.state.products} onDelete={this.handleDeleteProduct} />} />

              <Route exact path="/" component={props => <Manage {...props} />} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
