import React from "react";

const Header = () => {
    return (
        <header>
            <div className="container-fluid logoContainer mb-4 ">
                <div className="row">
                    <div className="col-md-4 col-sm-12 d-flex justify-content-center">
                        <img src="https://energospb.ru/images/energoLogoRu.png" className="img-fluid logo" alt="Energo"/>
                    </div>
                    <div className="col-md-8 col-sm-12">
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;