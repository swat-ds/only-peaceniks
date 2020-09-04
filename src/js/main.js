import '../css/main.scss';
import '../fonts/Larsseit.woff';
import '../imgs/external-link.svg';
import '../imgs/kanopy-logo.jpg';
import '../imgs/GitHub-Mark-64px.png';

import $ from 'jquery';
import dt from 'datatables.net/js/jquery.dataTables.min.js';
import langs from 'langs';

import thumbnails from '../data/thumbnails.json';
// import reports from '../data/reports.xml';
import keys from '../data/keys.json'

const op = (function(){


    /* globals */

    // let thumbnailsNew = {};
    const almaParams = {
        url: "https://api-na.hosted.exlibrisgroup.com/almaws/v1/analytics/reports",
        data: {
            path:"/shared/Tri College Consortium 01TRI_INST/Reports/SC/Electronic Resources/SC Kanopy Titles Expiring Soon",
            limit: 1000,
            type: 'xml',
            col_names: true,
            apikey: keys.alma
        },
        success: ''
    };

    const permalinkBase = "https://tripod.swarthmore.edu/permalink/01TRI_INST/ba5lsr/alma";

    const omdbParams = {
        type: 'GET',
        url: "http://www.omdbapi.com/",
        data: {
            t: 'film',
            y: 'year',
            apikey: keys.omdb
        },
        async: false,
        dataType: 'json',
        success: ''
    };

    const titleList = $('#kanopy-list table');
    const testImg = "https://m.media-amazon.com/images/M/MV5BNDVmZGMyM2MtNzAyZS00NzEzLThiMTUtZGVjYTdlNDg3MDBmXkEyXkFqcGdeQXVyMjIwNjIxNjc@._V1_SX300.jpg";

    /* ajax callback */

    almaParams.success = function(d) {

        /* parse response xml */
        const rows = d.getElementsByTagName("Row");
        let tableData = [];
        // const rows = reports.report.QueryResult[0].ResultXml[0].rowset[0].Row;
        for (let i = 0; i < rows.length; i++) {

            if (rows[i].childNodes.length == 15) {

                /* movie row object */
                let currRow = {};

                /* title */
                let cell1 = rows[i].getElementsByTagName("Column1")[0];
                currRow.title = cell1.innerHTML.normalize().replace(/\.$/,'');

                /* thumbnail */
                // if (thumbnails[currRow.title]){
                currRow.thumb = thumbnails[currRow.title] || null;
                currRow.thumb = thumbnails[currRow.title];

                /* language */
                let cell2 = cell1.nextElementSibling;
                currRow.lang = langs.where("2B",cell2.innerHTML) 
                        ? langs.where("2B",cell2.innerHTML).name : 'English';
                
                /* permalink */
                let cell3 = cell2.nextElementSibling;
                currRow.permalink = (permalinkBase + cell3.innerHTML);
                
                /* publication year */
                let cell4 = cell3.nextElementSibling;
                currRow.pubYear = (cell4.innerHTML.replace(/\.$/,''));
                
                /* kanopy uri */
                let cell5 = cell4.nextElementSibling;
                currRow.uri = cell5.innerHTML;

                /* expiration data */
                let cell6 = cell5.nextElementSibling;
                currRow.expiry = cell6.innerHTML;
                console.log(currRow.expiry);

                /* (attempting) to account for variability 
                in how dates are entered */
                try {

                    if (currRow.expiry.includes('/')){
                        currRow.expiry = currRow.expiry
                                            .match(/\d+\/\d+\/\d+/)[0]
                    } else {

                    currRow.expiry = currRow.expiry
                                        .replace(/(\d+)[., ]+(\d+)/,'$1 $2')
                                        .match(/\w+ \d+ \d+/)[0]
                                        .trim();
                    }

                    /* create date object */
                    currRow.expiry = new Date(currRow.expiry)
                                        .toISOString()
                                        .substring(0,10);

                } catch(e) {
                    console.error(e)
                }

                /* append table rows */
                let currTableRow = $('<tr/>');
                
                let ifThumb = currRow.thumb ? ' src="' + currRow.thumb + '" alt="' + currRow.title + '"' : 'class="no-thumb"';
                currTableRow.append('<td><img ' + ifThumb + ' "/></td>');
                
                currTableRow.append('<td><a href="' + currRow.permalink + '"><h4>' + currRow.title +'</h4></a>'
                + '<a href="' + currRow.uri + '"><span class="link"> View on Kanopy</span></td>');
                
                currTableRow.append('<td>' + currRow.lang + '</td>');
                
                currTableRow.append('<td>' + currRow.pubYear + '</td>');
                
                currTableRow.append('<td>' + currRow.expiry + '</td>');

                $('#list').append(currTableRow);

                /* fetching new thumbnails from omdb 
                    todo: make this process saner
                */
                // if(currRow.thumb == 'N/A'){
                //     omdbParams.data.t = currRow.title.replace(/-.*$/,'')
                //                                     .replace(/&amp;/,'');
                //     omdbParams.data.y = currRow.pubYear;
                //     omdbParams.success = function(d){
                //         thumbnailsNew[currRow.title] = d.Poster || null;
                //     }
                //     $.ajax(omdbParams);
                // }
            // }
            }
        }

        /* show list */
        $('#kanopy-list').toggleClass('loaded');

        /* initialize datatable */
        $('#list').DataTable({
            // "orderFixed": [ 0, 'desc' ]
        });

    //    console.log(thumbnailsNew);
    }

    const init = function(){
        $.ajax(almaParams);
    }

    return {
        init: init
    }
}($));

$(function(){
    op.init();
});
