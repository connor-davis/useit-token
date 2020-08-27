import React, { Component } from "react";
import { Link } from "react-router-dom";

class Manage extends Component {
    render() {
        return (
            <div>
                <div className="d-row">
                    <div className="d-column">
                        <Link to="/createUser" className="d-btn d-btn-primary d-btn-block">Create User</Link>
                        <Link to="/updateUser" className="d-btn d-btn-primary d-btn-block">Update User</Link>
                        <Link to="/scanUser" className="d-btn d-btn-primary d-btn-block">Scan User</Link>
                        <Link to="/userList" className="d-btn d-btn-primary d-btn-block">User List</Link>
                    </div>

                    <div className="d-column">
                        <Link to="/createProduct" className="d-btn d-btn-primary d-btn-block">Create Product</Link>
                        <Link to="/updateProduct" className="d-btn d-btn-primary d-btn-block">Update Product</Link>
                        <Link to="/productList" className="d-btn d-btn-primary d-btn-block">Products List</Link>
                    </div>
                </div>
                <div onClick={this.props.history.goBack} className="d-btn d-btn-primary d-center">Back</div>
            </div>
        );
    }
}

export default Manage;