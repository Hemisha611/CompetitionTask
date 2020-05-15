//<reference path="../createjob/createjob.jsx" />
  //  <reference path="../createjob/createjob.jsx" />

import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, ButtonGroup, Header } from 'semantic-ui-react';
import * as moment from 'moment';
import { Button, Card, Image } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';




export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        //loader.allowedUsers.push("Employer");
        //loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {

            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);

        this.handleOnChange = this.handleOnChange.bind(this)


    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.allowedUsers.push("Employer");
        loaderData.allowedUsers.push("Recruiter");
        loaderData.isLoading = false;
        this.setState({ loaderData, });

    }

    componentDidMount() {
        this.loadData(this.state.activePage,
            this.state.sortBy.date,
            this.state.filter.showActive,
            this.state.filter.showClosed,
            this.state.filter.showDraft,
            this.state.filter.showExpired,
            this.state.filter.showUnexpired
        );
    };

    //setPageNum(event, { activePage }) {
    //    this.setState({ activePage: activePage });
    //};

    handleOnChange(e, data) {
        console.log(data.value);
        if (data.value == 'Newest first') {
            this.loadData(this.state.activePage, "desc", this.state.filter.showActive,
                this.state.filter.showClosed, this.state.filter.showDraft,
                this.state.filter.showExpired, this.state.filter.showunUnexpired);
        } else {
            this.loadData(this.state.activePage, "", this.state.filter.showActive,
                this.state.filter.showClosed, this.state.filter.showDraft,
                this.state.filter.showExpired, this.state.filter.showUnexpired);
        }
    }


    loadData(activepage, sortbydate, showactive, showclosed, showdraft, showexpired, showunexpired) {
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs'
        var data =
        {
            activePage: activepage,
            sortbyDate: sortbydate,
            showActive: showactive,
            showClosed: showclosed,
            showDraft: showdraft,
            showExpired: showexpired,
            showUnexpired: showunexpired
        }
        console.log("Manage job link", link);
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            dataType: "json",
            type: "GET",
            contentType: "application/json",
            data: data,
            success: function (res) {
                console.log("loadJobs data", res);
                let loadJobs = []
                if (res.myJobs) {
                    loadJobs = res.myJobs
                    console.log("myJobs data", loadJobs);
                    this.setState(
                        {
                            loadJobs: res.myJobs
                        })
                }
            }.bind(this),

            error: function (res) {
                console.log(res.myJobs)
            }
        })
        this.init()
    }


    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    render() {
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <section className="page-body">
                    <div className="ui container">
                        <div className="ui grid">
                            <div className="row">
                                <div className="sixteen wide center aligned padded column">
                                    <h1><strong>List Of Jobs</strong></h1>
                                </div>
                            </div>

                            < div >
                                <i aria-hidden="true" className="filter icon" style={{ color: 'black' }}></i>

                 Filter :
                     <Dropdown text='Choose filter' style={{ color: 'black' }}>
                                    <Dropdown.Menu>
                                        <Dropdown.Item text='showActive' />
                                        <Dropdown.Item text='ShowClosed' />
                                        <Dropdown.Item text='showDraft' />
                                        <Dropdown.Item text='showexpired' />
                                        <Dropdown.Item text='showUnexpired' />
                                    </Dropdown.Menu>
                                </Dropdown     >


                                <i aria-hidden="true" className="calendar alternate icon" style={{ color: 'black' }}></i>
                    Sort By date :
                    <Dropdown text='Newest first' style={{ color: 'black' }}>
                                    <Dropdown.Menu>
                                        <Dropdown.Item text='Newest First' />
                                        <Dropdown.Item text='Oldest First' />
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div></div>
                    <br /><br />


                    <div className="ui container">
                        <div className="ui three column grid">
                            <div className="row">
                                {
                                    this.state.loadJobs.map(data => {
                                        return (

                                            <Card.Group style={{ width: 28 + "%" }} >
                                                <Card style={{hight: 70 + "%"}}>
                                                    <Card.Content >

                                                        <Card.Header><strong>{data.title}</strong></Card.Header>
                                                        <Card.Meta>{data.location.city}, {data.location.country}
                                                        
                                        </Card.Meta>
                                                        <Card.Description  >{data.summary}
                                                            <div className="extra content" style={{ marginTop: '70px' }}/>
                                                            
                                        </Card.Description>
                                                    </Card.Content>
                                                    <Card.Content >
                                                        <div className='ui four buttons'>
                                                            <Button color='red'>
                                                                Expire
                                            </Button>
                                                            <Button content='Close' icon='close' basic color='teal'></Button>
                                                            <Button content='Edit' icon='edit' basic color='teal'></Button>
                                                            <Button content='Copy' icon='copy' basic color='teal'></Button>
                                                        </div>
                                                    </Card.Content>
                                                </Card>
                                            </Card.Group>
                                            
                                    
                                        )
                                    }
                                    )
                                }        
                            </div>
                        </div>
                    </div>
                    
                </section>
            </BodyWrapper>
        );
  
    }
}