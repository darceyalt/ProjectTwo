var states = ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL',
'GA','GU','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA',
'MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
'OH','OK','OR','PA','PR','RI','SC','SD','TN','TX','UT','VT',
'VA','WA','WV','WI','WY']


document.addEventListener('DOMContentLoaded', function() {
    var searchBtn = document.querySelector("#submit");
    var dataURL = "/data";
    d3.json(dataURL, function(error, response) {
        if (error) {
            return console.warn(error);
        }

        var select = response;
        var years = []
        for (var i = 0; i<select.length; i++) {
            years.push(select[i].Year);
        };
        var uniqueYears = years.filter(onlyUnique).sort();
        uniqueYears.unshift("All");
        for (var i = 0; i < uniqueYears.length; i++) {
            var option = document.createElement("option");
            option.innerText = uniqueYears[i];
            selYear.appendChild(option);
        };
    })

    var questions = ["Cases of Diabetes",
    "Cases of Diabetes and High Blood Pressure",
    "Cases of Diabetes and High Cholesterol"];
    var selQuestion = document.getElementById("selQuestion");
    var selYear = document.getElementById("selYear");
    for (var i = 0; i < questions.length; i++) {
        var option = document.createElement("option");
        option.innerText = questions[i];
        selQuestion.appendChild(option);
    };
    var selQuestion2 = document.getElementById("selQuestion2");
    for (var i = 0; i < questions.length; i++) {
        var option = document.createElement("option");
        option.innerText = questions[i];
        selQuestion2.appendChild(option);
    };

    var selState = document.getElementById("selState");
    for (var i = 0; i < states.length; i++) {
        var option = document.createElement("option");
        option.innerText = states[i];
        selState.appendChild(option);
    };
    init();
    searchBtn.addEventListener("click", handleSearchButtonClick);
});

// var question = "Cases of Diabetes"
function init() {
    var new_data = data;
    var question = selQuestion.options[selQuestion.selectedIndex].text;
    var diabetes_state = [];
    var diabetes_value = [];
    for (var i = 0; i<new_data.length; i++) {
        var diabetes = [];
        if (new_data[i].AbbrQuestion == question && new_data[i].Gender == "Overall") {
            diabetes.push(new_data[i]);
            diabetes_state.push(diabetes[0].LocationAbbr);
            diabetes_value.push(diabetes[0].DataValue);
        }
    }
    for (var i = 0; i<states.length; i++) {
        var state_value = [];
        for (var j = 0; j<diabetes_state.length; j++) {
            if (states[i] == diabetes_state[j]) {
                state_value.push(diabetes_value[j]);
            }
        }
        var total = 0
        for (var k = 0; k<state_value.length; k++) {
            total += state_value[k];
        }
        var abbr=states[i];
        var light = 100-((total-30)*1.5)
        var hexColor = hslToHex(146 , 23, light)
        simplemaps_usmap_mapdata.state_specific[abbr].color = hexColor;
        console.log(`${abbr}: ${hexColor}`)
    }
};

function update() {
    var new_data = data;
    var question = selQuestion.options[selQuestion.selectedIndex].text;
    var diabetes_state = [];
    var diabetes_value = [];
    for (var i = 0; i<new_data.length; i++) {
        var diabetes = [];
        if (new_data[i].AbbrQuestion == question && new_data[i].Gender == "Overall") {
            diabetes.push(new_data[i]);
            diabetes_state.push(diabetes[0].LocationAbbr);
            diabetes_value.push(diabetes[0].DataValue);
        }
    }
    for (var i = 0; i<states.length; i++) {
        var state_value = [];
        for (var j = 0; j<diabetes_state.length; j++) {
            if (states[i] == diabetes_state[j]) {
                state_value.push(diabetes_value[j]);
            }
        }
        var total = 0
        for (var k = 0; k<state_value.length; k++) {
            total += state_value[k];
        }
        var abbr=states[i];
        var light = 100-((total-30)*1.5);
        var hexColor = hslToHex(146 , 23, light);
        console.log(`${abbr}:${hexColor}`);
        simplemaps_usmap_mapdata.state_specific[abbr].color = hexColor;
    }
};

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
};

function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = x => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  
function handleSearchButtonClick() {
    var filter = data;
    var year = selYear.options[selYear.selectedIndex].text;
    if (year == "All") {
        new_data = filter;
        update();
    }
    else {
        new_data = [];
        for (var i=0; i<filter.length; i++) {
            if (filter[i].Year == year) {
                new_data.push(filter[i]);
            }
        }
        update();
    }
}