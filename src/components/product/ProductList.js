import React, { Component } from "react";
import { Link } from "react-router-dom";

class ProductList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            products: []
        }
    }

    exportToExcel() {
        var tableToExcel = (function () {
            var uri = 'data:application/vnd.ms-excel;base64,'
                , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><?xml version="1.0" encoding="UTF-8" standalone="yes"?><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
                , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
                , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
            return function (table, name) {
                if (!table.nodeType) table = document.getElementById(table)
                var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML, filename: name }

                const filename = name + ".xlsx";

                const data = uri + base64(format(template, ctx));
                const downloadLink = document.createElement("a");

                document.body.appendChild(downloadLink);

                downloadLink.href = data;
                downloadLink.download = filename;
                downloadLink.click();
            }
        })()

        tableToExcel("d-table", "data-" + Date.now());
    }

    async componentDidMount() {
        let products = Object.values(this.props.products);

        let sorted = products;

        if (products) {
            sorted = products.sort((a, b) => {
                var nameA = a.productName.split(" ")[0].toLowerCase() || "";
                var nameB = b.productName.split(" ")[0].toLowerCase() || "";
    
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
    
                return 0;
            });
        }

        sorted.map(async (u) => {
            this.setState({
                products: sorted
            });
        })
    }

    updateProduct(name) {
        this.props.history.push("/updateProduct/" + name);
    }

    deleteProduct(name) {
        this.props.onDelete(name);
    }

    render() {
        return (
            <div className="d-content">
                <canvas id="qr-div" width={256} height={256} className="d-qr-canvas" style={{ display: "none" }} />
                <canvas id="card-div" className="d-card-canvas" style={{ display: "none" }} />

                <div className="d-scanner">
                    <table id="d-table" className="d-table">
                        <thead className="d-table-head">
                            <tr className="d-table-row">
                                <th className="d-table-column">Product Name</th>
                                <th className="d-table-column">Product Price</th>
                            </tr>
                        </thead>

                        {this.state.products.map(p =>
                            <tbody key={p.productName} className="d-table-body">
                                <tr className="d-table-row">
                                    <td className="d-table-column">{p.productName}</td>
                                    <td className="d-table-column">{p.productPrice}</td>
                                    <td className="d-table-column d-btn" onClick={this.updateProduct.bind(this, p.productName)}>Update</td>
                                    <td className="d-table-column d-btn" onClick={this.deleteProduct.bind(this, p.productName)}>Delete</td>
                                </tr>
                            </tbody>)}
                    </table>

                    <div className="d-row">
                        <div className="d-btn d-btn-primary" onClick={this.exportToExcel.bind(this)}>Export Data</div>
                        <Link to="/" className="d-btn d-btn-primary">Back</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProductList;