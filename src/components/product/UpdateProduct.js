import React, { Component } from "react";
import { Link } from "react-router-dom";

class UpdateProduct extends Component {

    constructor(props) {
        super(props);

        this.state = {
            products: [],
            productName: "",
            productPrice: ""
        }

        this.setProductName = this.setProductName.bind(this);
        this.setProductPrice = this.setProductPrice.bind(this);
    }

    setProductName(e) {
        this.setState({
            productName: e.target.value
        })
    }
    setProductPrice(e) {
        this.setState({
            productPrice: e.target.value
        })
    }

    updateProduct() {
        const name = this.state.productName;
        const price = this.state.productPrice;

        if (name !== "" && price > 0) {
            this.props.onUpdate({ productName: name, productPrice: price });

            setTimeout(() => {
                this.props.history.push("/productList");
            }, 1000);
        }
    }

    componentDidMount() {
        const { name } = this.props.match.params;
        const products = Object.values(this.props.products);

        if (name) {
            const product = products.filter(p => p.productName === name)[0];

            if (product) {
                this.setProductName({ target: { value: product.productName } });
                this.setProductPrice({ target: { value: product.productPrice } });
            } else {
                this.setProductName({ target: { value: name } });
                this.setProductPrice({ target: { value: 0 } });
            }
        } else {
            this.setProductName({ target: { value: name } });
            this.setProductPrice({ target: { value: 0 } });
        }
    }

    render() {
        return (
            <div className="d-center d-form">
                <h1 className="d-content-title">Update Product</h1>
                <div className="d-create-user-form">
                    <div className="d-input-group">
                        <input className="d-input" placeholder="Product Name" value={this.state.productName} onChange={this.setProductName} />
                        <input className="d-input" placeholder="Product Value @ 1kg" value={this.state.productPrice} onChange={this.setProductPrice} />
                    </div>

                    <div className="d-row">
                        <div className="d-btn d-btn-primary" onClick={this.updateProduct.bind(this)}>Update</div>
                        <Link to="/" className="d-btn d-btn-primary">Back</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default UpdateProduct;