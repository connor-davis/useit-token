import React, { Component } from "react";
import { Link } from "react-router-dom";

class CreateProduct extends Component {
    constructor(props) {
        super(props);

        this.state = {
            product: {
                productName: "",
                productPrice: 0.0
            }
        }

        this.handleProductNameChange = this.handleProductNameChange.bind(this);
        this.handleProductPriceChange = this.handleProductPriceChange.bind(this);
    }

    handleProductNameChange(e) {
        this.setState({
            product: {
                ...this.state.product,
                productName: e.target.value
            }
        });
    }

    handleProductPriceChange(e) {
        this.setState({
            product: {
                ...this.state.product,
                productPrice: e.target.value
            }
        });
    }

    createProduct() {
        const product = this.state.product;
        if (product.productName !== "" && product.productPrice > 0) {
            this.props.onCreate(product);
            
            setTimeout(() => {
                this.props.history.push("/productList");
            }, 1000);
        }
    }

    render() {
        return (
            <div className="d-center d-form">
                <h1 className="d-content-title">Create Product</h1>
                <div className="d-create-user-form">
                    <div className="d-input-group">
                        <input className="d-input" placeholder="Product Name" value={this.state.product.productName} onChange={this.handleProductNameChange} />
                        <input type="number" className="d-input" placeholder="Product Value @ 1kg" value={this.state.product.productPrice} onChange={this.handleProductPriceChange} />
                    </div>

                    <div className="d-row">
                        <div className="d-btn d-btn-primary" onClick={this.createProduct.bind(this)}>Create</div>
                        <Link to="/" className="d-btn d-btn-primary">Back</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateProduct;