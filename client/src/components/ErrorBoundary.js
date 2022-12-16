import React, { Component } from "react";
import "../css/layout.css";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    };
  }

  // componentDidCatch(error,errorInfo){
  //     console.log("error",error,errorInfo)
  // }
  render() {
    if (this.state.hasError) {
      return (
        <>
          <div className="error-container">
            <div>
              <h1 className="error-heading">Oops!</h1>
              <p className="error-para">
                <b>Something went wrong</b>
              </p>
            </div>
            <div>
              {/* <Link to={{pathname: "/"}}>Home</Link> */}
              {/* <button className="btn btn-primary" style={{background:'red',borderRadius:'20px'}} > Go to Homepage</button> */}
            </div>
          </div>
        </>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
