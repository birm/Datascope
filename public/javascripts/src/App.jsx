/* global d3 */
/* global dc */
/* global queryFilter */
/* global globalDataSourceName */

//Global
queryFilter = {};

//dc.constants.EVENT_DELAY = 300;

var filteredData = {};

//var dataTable;

var React = require("react");
var ReactDOM = require("react-dom");
var AppActions = require("./actions/AppActions.jsx");
var AppStore = require("./stores/AppStore.jsx");
//var Reflux = require('reflux');
var InteractiveFilters = React.createFactory(require("./components/InteractiveFilters.jsx"));
var Visualizations = require("./components/Visualizations.jsx");
var NavBar = require("./components/Navbar.jsx");
//var Loader = require('react-loader');

var interactiveFilters = {},
    visualization = {};
var Dashboard = React.createClass({
        //mixins: [Reflux.connect(AppStore,"currData")], // will set up listenTo call and then do this.setState("currData",data)
    componentDidMount: function(){      
        var self=this;    

//        console.log("Waxzaaswoot!"); adsff
        self.unsubscribe = AppStore.listen(self.onFilter);

        d3.json("config/interactiveFilters", function(err, data) {

            if(err) {
                console.log(err);
                return;
            }
            interactiveFilters = data;
            d3.json("config/visualization", function(err, data) {

                if(err) {
                    console.log(err);
                    return;
                }
                visualization = data;   
                AppActions.refresh(queryFilter); //Initial refresh
                filteredData = AppStore.getData();
                //Do the initial filtering 
                d3.json("data/?filter={}&dataSourceName=" + globalDataSourceName, function(d) {
                    filteredData = d;
                    self.setState({
                        interactiveFilters: interactiveFilters,
                        visualization: visualization,
                        currData: filteredData,
                        loaded: true,
                        debug: 0
                    });



                    dc.renderAll();
                });
                
                
            });

        });

        d3.json("config/dashboard", function(config){
            var dashBoardConfig =  config || {};

            Theme = dashBoardConfig.theme;
            self.setState({ dashboardConfig: config});

        });
    },
    componentWillMount: function(){

    },
    getInitialState: function(){
        return {interactiveFilters: null, visualization: null, filter: null, loaded: false, dashboardConfig: null};
    },
    onFilter: function(){
        this.setState({loading: true});
        
        var data = AppStore.getData();
        //var debug=this.state.debug+1;

        this.setState({currData: data, loading: false});
        dc.renderAll();

    },
    render: function(){
        //var currData = this.state.currData;
          //interactiveFiltersData = currData.interactiveFilters,
          //visualizationData = currData.visualization;
        //console.log(this.state.loaded);
        var loading =  this.state.loading;

        return (
          <div id="main_container">
            <NavBar />
            { loading ?
                <h1 id="loadingMessage"> Loading </h1>
            :
                <div />
            }
            <InteractiveFilters dashboardConfig={this.state.dashboardConfig} onFilter={this.onFilter} config={this.state.interactiveFilters} currData={this.state.currData}>
            </InteractiveFilters>
            <Visualizations dashboardConfig={this.state.dashboardConfig} config={this.state.visualization} debug={this.state.debug} currData={this.state.currData}>
            </Visualizations>
            <div id="footer" className="clear"></div>
          </div>
        );
    }

});


ReactDOM.render(<Dashboard />, document.getElementById("main"));
