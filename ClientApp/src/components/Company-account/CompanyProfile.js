import React, { Component } from "react";
import Modal from "../Modal";
import "./CompanyProfile.css";
import { withRouter } from "react-router-dom";
import Loading from "../Universal/Loading";
import { Form } from "react-bootstrap";

class CompanyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      company: "",
      loading: true,
      companyLogoPath: "",
      logoIsOpen: false,
      companyName: "",
      nameIsOpen: false,
      companyDescription: "",
      descriptionIsOpen: false,
      companyIndustry: "",
      industryIsOpen: false,
      companyAddress: "",
      addressIsOpen: false,
      companyWebsite: "",
      isAuthenticated: false,
      userName: null,
      userId: null,
      logoFormData: null,
    };
    this.renderCompanyProfileData = this.renderCompanyProfileData.bind(this);
  }

  componentDidMount() {
    this.populateCompanyProfileData();
  }

  async populateCompanyProfileData() {
    let user = JSON.parse(sessionStorage.getItem("user"));
    this.setState({ userId: user.id });
    var companyResponse = await fetch("api/companies/" + user.id);
    var companyData = "";
    if (companyResponse.ok) companyData = await companyResponse.json();

    this.setState({
      company: companyData,
      loading: false,
      companyName: companyData.name,
      companyDescription: companyData.description,
      companyIndustry: companyData.industry,
      companyAddress: companyData.address,
      companyWebsite: companyData.website,
      companyLogoPath: companyData.logoPath,
    });
  }

  handleCompanyNameChange = (changeEvent) => {
    this.setState({
      companyName: changeEvent.target.value,
    });
  };

  handleCompanyNameForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    var modifiedCompany = this.state.company;
    modifiedCompany.name = this.state.companyName;
    this.setState({
      company: modifiedCompany,
    });
    var aux = "api/companies/" + this.state.userId;
    await fetch(aux, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(this.state.company),
    });
    this.setState({ nameIsOpen: false });
  };

  handleCompanyDescriptionChange = (changeEvent) => {
    this.setState({
      companyDescription: changeEvent.target.value,
    });
  };

  handleCompanyDescriptionForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    var modifiedCompany = this.state.company;
    modifiedCompany.description = this.state.companyDescription;
    this.setState({
      company: modifiedCompany,
    });
    var aux = "api/companies/" + this.state.userId;
    await fetch(aux, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(this.state.company),
    });
    this.setState({ descriptionIsOpen: false });
  };

  handleCompanyIndustryChange = (changeEvent) => {
    this.setState({
      companyIndustry: changeEvent.target.value,
    });
  };

  handleCompanyIndustryForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    var modifiedCompany = this.state.company;
    modifiedCompany.industry = this.state.companyIndustry;
    this.setState({
      company: modifiedCompany,
    });
    var aux = "api/companies/" + this.state.userId;
    await fetch(aux, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(this.state.company),
    });
    this.setState({ industryIsOpen: false });
  };

  handleCompanyAddressChange = (changeEvent) => {
    this.setState({
      companyAddress: changeEvent.target.value,
    });
  };

  handleCompanyAddressForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    var modifiedCompany = this.state.company;
    modifiedCompany.address = this.state.companyAddress;
    this.setState({
      company: modifiedCompany,
    });
    var aux = "api/companies/" + this.state.userId;
    await fetch(aux, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(this.state.company),
    });
    this.setState({ addressIsOpen: false });
  };

  handleCompanyWebsiteChange = (changeEvent) => {
    this.setState({
      companyWebsite: changeEvent.target.value,
    });
  };

  handleCompanyWebsiteForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    var modifiedCompany = this.state.company;
    modifiedCompany.website = this.state.companyWebsite;
    this.setState({
      company: modifiedCompany,
    });
    var aux = "api/companies/" + this.state.userId;
    await fetch(aux, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(this.state.company),
    });
    this.setState({ websiteIsOpen: false });
  };

  changeBackgroundOver = (changeEvent) => {
    if (changeEvent.target.className === "col-xs")
      changeEvent.target.parentElement.parentElement.style.background =
        "rgba(128,128,128,0.75)";
    else if (changeEvent.target.className === "row")
      changeEvent.target.parentElement.style.background = "rgba(128,128,128,0.75)";
    else if (changeEvent.target.tagName === "B" || changeEvent.target.tagName === "H3")
      changeEvent.target.parentElement.parentElement.parentElement.style.background =
        "rgba(128,128,128,0.75)";
    else changeEvent.target.style.background = "rgba(128,128,128,0.75)";
    changeEvent.target.style.cursor = "pointer";
  };

  changeBackgroundOut = (changeEvent) => {
    if (changeEvent.target.className === "col-xs")
      changeEvent.target.parentElement.parentElement.style.background = "none";
    else if (changeEvent.target.className === "row")
      changeEvent.target.parentElement.style.background = "none";
    else if (changeEvent.target.tagName === "B" || changeEvent.target.tagName === "H3")
      changeEvent.target.parentElement.parentElement.parentElement.style.background =
        "none";
    else changeEvent.target.style.background = "none";
    changeEvent.target.style.cursor = "none";
  };

  handleCompanyLogoChange = (event) => {
    event.preventDefault();
    this.photoFileName = event.target.files[0].name;
    const formData = new FormData();
    formData.append("myFile", event.target.files[0], event.target.files[0].name);

    console.log(formData);

    this.setState({ logoFormData: formData });

    let preview = document.getElementById("thumbnail");

    const handleFiles = (file) => {
      if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.classList.add("obj");
        img.file = file;
        preview.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.

        const reader = new FileReader();
        reader.onload = (function (aImg) {
          return function (e) {
            aImg.src = e.target.result;
          };
        })(img);
        reader.readAsDataURL(file);
      }
    };

    handleFiles(event.target.files[0]);
  };

  handleCompanyLogoFormSubmit = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();

    await fetch("api/companies/savefile/" + this.state.company.id, {
      method: "POST",
      body: this.state.logoFormData,
    })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            companyLogoPath: result,
          });
        },
        (error) => {
          alert("Failed upload image");
        }
      );

    var modifiedCompany = this.state.company;
    modifiedCompany.logoPath = this.state.companyLogoPath;
    this.setState({
      company: modifiedCompany,
    });
    var aux = "api/companies/" + this.state.userId;
    await fetch(aux, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(this.state.company),
    });

    this.setState({ logoIsOpen: false });
  };

  renderCompanyProfileData() {
    return (
      <div
        className="border border border-5 shadow p-3 mb-5 bg-body rounded"
        style={{
          width: 900,
          backgroundColor: "lightblue",
          margin: "auto",
          padding: 50,
        }}
      >
        <img
          width="200"
          height="100"
          alt="logo"
          src={"logos/" + this.state.company.logoPath}
          onMouseOver={(event) => (event.target.style.cursor = "pointer")}
          onMouseOut={(event) => (event.target.style.cursor = "normal")}
          onClick={(event) => this.setState({ logoIsOpen: true })}
        />

        {/*<form onSubmit={this.handleCompanyLogoFormSubmit}>
                    <div id="thumbnail">
                        Imagine companie:
                            <input
                            type="file"
                            onChange={this.handleCompanyLogoChange}
                        />
                    </div>

                    <div>
                        <button className="btn btn-primary mt-2" type="submit">
                            Salveaza
                            </button>
                    </div>

                </form> */}

        <Modal
          open={this.state.logoIsOpen}
          onClose={() =>
            this.setState({
              logoIsOpen: false,
            })
          }
        >
          <form onSubmit={this.handleCompanyLogoFormSubmit}>
            <div id="thumbnail">
              Imagine companie:
              <input type="file" onChange={this.handleCompanyLogoChange} />
            </div>

            <div>
              <button className="btn btn-primary mt-2" type="submit">
                Salveaza
              </button>
            </div>
          </form>
        </Modal>

        <br />

        <br />

        <div style={{ paddingLeft: 8 }}>
          <b
            style={{
              color: "#0c56a5",
              fontSize: 18,
            }}
          >
            NUME COMPANIE
          </b>
          <hr
            style={{
              marginTop: -5,
              borderTop: "2px solid gray",
            }}
          />
        </div>

        <div
          className="container rounded"
          style={{
            padding: 10,
            paddingRight: 25,
            paddingLeft: 25,
            width: 850,
          }}
          onMouseOver={this.changeBackgroundOver}
          onMouseOut={this.changeBackgroundOut}
          onClick={(event) => {
            this.setState({ nameIsOpen: true });
            this.changeBackgroundOut(event);
          }}
        >
          <div style={{}} className="row">
            <div className="col-xs" style={{ whiteSpace: "pre-line" }}>
              <b
                style={{
                  wordBreak: "break-all",
                  wordWrap: "break-word",
                }}
              >
                {this.state.company.name}
              </b>
            </div>
          </div>
        </div>

        <Modal
          open={this.state.nameIsOpen}
          onClose={() =>
            this.setState({
              nameIsOpen: false,
              companyName: this.state.company.name,
            })
          }
        >
          <form onSubmit={this.handleCompanyNameForm}>
            <div>
              Nume companie:
              <input
                type="text"
                placeholder="Nume"
                name="companyName"
                value={this.state.companyName}
                onChange={this.handleCompanyNameChange}
              />
            </div>

            <div>
              <button className="btn btn-primary mt-2" type="submit">
                Salveaza
              </button>
            </div>
          </form>
        </Modal>

        <br />

        <div style={{ paddingLeft: 8 }}>
          <b
            style={{
              color: "#0c56a5",
              fontSize: 18,
            }}
          >
            DESCRIERE
          </b>
          <hr
            style={{
              marginTop: -5,
              borderTop: "2px solid gray",
            }}
          />
        </div>

        <div
          className="container rounded"
          style={{
            padding: 10,
            paddingRight: 25,
            paddingLeft: 25,
            width: 850,
          }}
          onMouseOver={this.changeBackgroundOver}
          onMouseOut={this.changeBackgroundOut}
          onClick={(event) => {
            this.setState({
              descriptionIsOpen: true,
            });
            this.changeBackgroundOut(event);
          }}
        >
          <div style={{}} className="row">
            <div className="col-xs" style={{ whiteSpace: "pre-line" }}>
              <b
                style={{
                  wordBreak: "break-all",
                  wordWrap: "break-word",
                }}
              >
                {this.state.company.description}
              </b>
            </div>
          </div>
        </div>

        <Modal
          open={this.state.descriptionIsOpen}
          onClose={() =>
            this.setState({
              descriptionIsOpen: false,
              companyDescription: this.state.company.description,
            })
          }
        >
          <form onSubmit={this.handleCompanyDescriptionForm}>
            <div>
              <Form.Group className="col-md-8">
                <Form.Label>Descriere</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={this.state.companyDescription}
                  onChange={this.handleCompanyDescriptionChange}
                  required={true}
                />
              </Form.Group>
            </div>

            <div>
              <button className="btn btn-primary mt-2" type="submit">
                Salveaza
              </button>
            </div>
          </form>
        </Modal>

        <br />

        <div style={{ paddingLeft: 8 }}>
          <b
            style={{
              color: "#0c56a5",
              fontSize: 18,
            }}
          >
            INDUSTRIE
          </b>
          <hr
            style={{
              marginTop: -5,
              borderTop: "2px solid gray",
            }}
          />
        </div>

        <div
          className="container rounded"
          style={{
            padding: 10,
            paddingRight: 25,
            paddingLeft: 25,
            width: 850,
          }}
          onMouseOver={this.changeBackgroundOver}
          onMouseOut={this.changeBackgroundOut}
          onClick={(event) => {
            this.setState({
              industryIsOpen: true,
            });
            this.changeBackgroundOut(event);
          }}
        >
          <div style={{}} className="row">
            <div className="col-xs" style={{ whiteSpace: "pre-line" }}>
              <b
                style={{
                  wordBreak: "break-all",
                  wordWrap: "break-word",
                }}
              >
                {this.state.company.industry}
              </b>
            </div>
          </div>
        </div>

        <Modal
          open={this.state.industryIsOpen}
          onClose={() =>
            this.setState({
              industryIsOpen: false,
              companyIndustry: this.state.company.industry,
            })
          }
        >
          <form onSubmit={this.handleCompanyIndustryForm}>
            <div>
              Industrie:
              <input
                type="text"
                name="companyIndustry"
                value={this.state.companyIndustry}
                onChange={this.handleCompanyIndustryChange}
              />
            </div>

            <div>
              <button className="btn btn-primary mt-2" type="submit">
                Salveaza
              </button>
            </div>
          </form>
        </Modal>

        <br />

        <div style={{ paddingLeft: 8 }}>
          <b
            style={{
              color: "#0c56a5",
              fontSize: 18,
            }}
          >
            ADRESA
          </b>
          <hr
            style={{
              marginTop: -5,
              borderTop: "2px solid gray",
            }}
          />
        </div>

        <div
          className="container rounded"
          style={{
            padding: 10,
            paddingRight: 25,
            paddingLeft: 25,
            width: 850,
          }}
          onMouseOver={this.changeBackgroundOver}
          onMouseOut={this.changeBackgroundOut}
          onClick={(event) => {
            this.setState({
              addressIsOpen: true,
            });
            this.changeBackgroundOut(event);
          }}
        >
          <div style={{}} className="row">
            <div className="col-xs" style={{ whiteSpace: "pre-line" }}>
              <b
                style={{
                  wordBreak: "break-all",
                  wordWrap: "break-word",
                }}
              >
                {this.state.company.address}
              </b>
            </div>
          </div>
        </div>

        <Modal
          open={this.state.addressIsOpen}
          onClose={() =>
            this.setState({
              addressIsOpen: false,
              companyAddress: this.state.company.address,
            })
          }
        >
          <form onSubmit={this.handleCompanyAddressForm}>
            <div>
              Nume:
              <input
                type="text"
                name="companyAddress"
                value={this.state.companyAddress}
                onChange={this.handleCompanyAddressChange}
              />
            </div>

            <div>
              <button className="btn btn-primary mt-2" type="submit">
                Salveaza
              </button>
            </div>
          </form>
        </Modal>

        <br />

        <div style={{ paddingLeft: 8 }}>
          <b
            style={{
              color: "#0c56a5",
              fontSize: 18,
            }}
          >
            WEBSITE
          </b>
          <hr
            style={{
              marginTop: -5,
              borderTop: "2px solid gray",
            }}
          />
        </div>

        <div
          className="container rounded"
          style={{
            padding: 10,
            paddingRight: 25,
            paddingLeft: 25,
            width: 850,
          }}
          onMouseOver={this.changeBackgroundOver}
          onMouseOut={this.changeBackgroundOut}
          onClick={(event) => {
            this.setState({
              websiteIsOpen: true,
            });
            this.changeBackgroundOut(event);
          }}
        >
          <div style={{}} className="row">
            <div className="col-xs" style={{ whiteSpace: "pre-line" }}>
              <b
                style={{
                  wordBreak: "break-all",
                  wordWrap: "break-word",
                }}
              >
                {this.state.company.website}
              </b>
            </div>
          </div>
        </div>

        <Modal
          open={this.state.websiteIsOpen}
          onClose={() =>
            this.setState({
              websiteIsOpen: false,
              companyWebsite: this.state.company.website,
            })
          }
        >
          <form onSubmit={this.handleCompanyWebsiteForm}>
            <div>
              Website:
              <input
                type="text"
                name="companyWebsite"
                value={this.state.companyWebsite}
                onChange={this.handleCompanyWebsiteChange}
              />
            </div>

            <div>
              <button className="btn btn-primary mt-2" type="submit">
                Salveaza
              </button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }
  render() {
    let contents = this.state.loading ? <Loading /> : this.renderCompanyProfileData();

    return <div>{contents}</div>;
  }
}

export default withRouter(CompanyProfile);
