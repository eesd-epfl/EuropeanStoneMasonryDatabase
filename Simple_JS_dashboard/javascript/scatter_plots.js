import {config} from '/javascript/config.js';
let gridplots = document.getElementById('gridplots');

//Final function.
export function createDivPagination(data){
    //Create array with filepaths and filenames:
    const fileNames = createCSVArray(data);
    //Create empty divs that will be paginated (hide all except 9):
    for (let i = 0; i<fileNames[0].length; i++){
        let newDiv = document.createElement('div');
        newDiv.id = fileNames[1][i];
        newDiv.className = "five wide column"
        gridplots.append(newDiv);
    }
    $("#gridplots").pagify(9, ".five.wide.column");
}

//Take active, filtered data from table and create an array with the name and filepath of each csv file to display 
function createCSVArray(data){
    let divName = [];
    let activePlotData = data;
    let selectedCurvesFilePaths = [];
    
    for (let i = 0; i<activePlotData.length; i++){
        if(activePlotData[i]['ID']>99){
            selectedCurvesFilePaths.push("data/curve"+activePlotData[i]['ID'] + ".csv");
        } else if (activePlotData[i]['ID']>9){
            selectedCurvesFilePaths.push("data/curve0"+ activePlotData[i]['ID']+ ".csv");
        } else{
            selectedCurvesFilePaths.push("data/curve00"+ activePlotData[i]['ID'] + ".csv"); 
        }
    }
    const randomizedCurveFilePaths = shuffle(selectedCurvesFilePaths);
    for (let i = 0; i<randomizedCurveFilePaths.length; i++){
        divName.push(randomizedCurveFilePaths[i].split('/')[1].split('.')[0]);
    }
    const csvData = [randomizedCurveFilePaths,divName];
    return csvData;
}

//Read CSV file and send data to createGraph function:
function parseData(createGraph,filePath,fileName){
    Papa.parse(filePath, {
        download: true,
        skipEmptyLines:true,
        header: false,
        complete: function(results){
            createGraph(results.data,fileName);
        }
    });
}

//Create the plot:
function createGraph(data,divId){
    let force = [];
    let displacement = [];
    let title = data[0][1];
    data[2][0] = 'top. disp. [mm]'
    data[2][1] = 'hor. force [kN]'

    for (let i = 2; i < data.length; i++){
        if((data[i][0]!='NaN' && data[i][1]!='NaN') && data[i][0]!='[mm]'){
            displacement.push(data[i][0]); //x axis
            force.push(data[i][1]); //y axis
        }
    }
    let chart = c3.generate({
        // bindto: '#'+divId,
        data:{
            names: {
                x: 'horizontal force'
            },
            x:displacement[0],
            columns:[displacement,force],
            type: 'scatter',
        },
        title:{
            text:title,
            position:"top-center"
        },
        axis:{
            y:{
                label:'hor. force [kN]',
                
            },
            x:{
                label: 'top. disp. [mm]',
                tick:{
                    format:function (x) {return x.toFixed()},
                    culling:{
                        max:4
                    },
                    fit:true,
                    count:3
                },
            }
        },
        legend: {
            hide:true
        },
        tooltip:{
            format: {
                title: function (x) {return 'disp. value: ' + x},
            }
        }
    })
    //Append chart element to the div that has its Id (e.g. curve001):
    document.getElementById(divId).append(chart.element);
}

//Randomizing function:
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}


//Pagination Function:
(function($) {
	let pagify = {
		items: {},
		container: null,
		totalPages: 1,
		perPage: 3,
		currentPage: 0,
		createNavigation: function() {
			this.totalPages = Math.ceil(this.items.length / this.perPage);

			$('.pagination', this.container.parent()).remove();
			let pagination = $('<div class="pagination"></div>').append('<a class="nav prev disabled" data-next="false"><</a>');

			for (let i = 0; i < this.totalPages; i++) {
                // console.log("page is " + i);
				let pageElClass = "page";
				if (!i)
					pageElClass = "page current";
				const pageEl = '<a class="' + pageElClass + '" data-page="' + (
				i + 1) + '">' + (
				i + 1) + "</a>";
				pagination.append(pageEl);
			}
			pagination.append('<a class="nav next" data-next="true">></a>');
			this.container.after(pagination);

			let that = this;
			$("body").off("click", ".nav");
			this.navigator = $("body").on("click", ".nav", function() {
				let el = $(this);
				that.navigate(el.data("next"));
			});

			$("body").off("click", ".page");
			this.pageNavigator = $("body").on("click", ".page", function() {
				let el = $(this);
				that.goToPage(el.data("page"));
			});
		},
		navigate: function(next) {
			// default perPage to 5
			if (isNaN(next) || next === undefined) {
				next = true;
			}
			$(".pagination .nav").removeClass("disabled");
			if (next) {
				this.currentPage++;
				if (this.currentPage > (this.totalPages - 1))
					this.currentPage = (this.totalPages - 1);
				if (this.currentPage == (this.totalPages - 1))
					$(".pagination .nav.next").addClass("disabled");
				}
			else {
				this.currentPage--;
				if (this.currentPage < 0)
					this.currentPage = 0;
				if (this.currentPage == 0)
					$(".pagination .nav.prev").addClass("disabled");
				}

			this.showItems();
		},
		updateNavigation: function() {

			let pages = $(".pagination .page");
			pages.removeClass("current");
			$('.pagination .page[data-page="' + (
			this.currentPage + 1) + '"]').addClass("current");
		},
		goToPage: function(page) {

			this.currentPage = page - 1;

			$(".pagination .nav").removeClass("disabled");
			if (this.currentPage == (this.totalPages - 1))
				$(".pagination .nav.next").addClass("disabled");

			if (this.currentPage == 0)
				$(".pagination .nav.prev").addClass("disabled");
			this.showItems();
		},
		showItems: function() {
            // clearBox(gridplots);
            // let table = Tabulator.findTable('#data-table3')[0];
            // const fileNames = createCSVArray(table.getData("active"));
            let divArray = Array.from(gridplots.children)
            for (let i = 0; i<divArray.length; i++){
                let myDivNode = document.getElementById(divArray[i].id)
                while (myDivNode.firstChild){
                    myDivNode.removeChild(myDivNode.lastChild);
                }
            }
            for (let i = (this.currentPage*this.perPage); i < (this.currentPage+1)*this.perPage; i++){
                console.log("value of i is:"+ i);
                let fileName = divArray[i].id
                let filePath = "data/"+ fileName + ".csv"
                parseData(createGraph,filePath,fileName);
            }
            this.items.hide();
			let base = this.perPage * this.currentPage;
			this.items.slice(base, base + this.perPage).show();
			this.updateNavigation();
		},
		init: function(container, items, perPage) {
			this.container = container;
			this.currentPage = 0;
			this.totalPages = 1;
			this.perPage = perPage;
			this.items = items;
			this.createNavigation();
			this.showItems();
		}
	};

	// stuff it all into a jQuery method!
	$.fn.pagify = function(perPage, itemSelector) {
		let el = $(this);
		let items = $(itemSelector, el);

		// default perPage to 5
		if (isNaN(perPage) || perPage === undefined) {
			perPage = 9;
		}

		// don't fire if fewer items than perPage
		// if (items.length <= perPage) {
		// 	return true;
		// }

		pagify.init(el, items, perPage);
	};
})(jQuery);
