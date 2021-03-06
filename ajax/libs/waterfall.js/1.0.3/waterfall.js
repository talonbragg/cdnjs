/*!
   --------------------------------
   Waterfall.js
   --------------------------------
   + https://github.com/raphamorim/waterfall
   + version 1.0.0
   + Copyright 2015 Raphael Amorim
   + Licensed under the MIT license
   + Documentation: https://github.com/raphamorim/waterfall
*/

function waterfall(container){
    if(typeof(container) === 'string')
        container = document.querySelector(container);

    container.style.position = 'relative';

    var boundary = [],
        // Freeze the list of nodes
        els = [].map.call(container.children, function(el){
            el.style.position = 'absolute';
            return el;
        });

    function style(el){ return window.getComputedStyle(el); }
    function margin(name, el){ return parseFloat(style(el)['margin' + name]) || 0; }

    function px(n){ return n + 'px'; }
    function y(el){ return parseFloat(el.style.top) ; }
    function x(el){ return parseFloat(el.style.left); }
    function width(el){ return parseFloat(style(el).width); }
    function height(el){ return parseFloat(style(el).height); }
    function bottom(el){ return y(el) + height(el) + margin('Bottom', el); }
    function right(el){ return x(el) + width(el) + margin('Right', el); }

    function sort(l){
        l = l.sort(function(a, b){
            var bottom_diff = bottom(b) - bottom(a);
            return bottom_diff || x(b) - x(a);
        });
    }


    // Deal with the first element.
    if(els.length){
        els[0].style.top = '0px';
        els[0].style.left = px(margin('Left', els[0]));
        boundary.push(els[0]);
    }

    // Deal with the first line.
    for(var i = 1; i < els.length; i++){
        var prev = els[i - 1],
        el = els[i],
        thereIsSpace = right(prev) + width(el) <= width(container);
        if(!thereIsSpace) break;
            el.style.top = prev.style.top;
        el.style.left = px(right(prev) + margin('Left', el));
        boundary.push(el);
    }

    // Place following elements at the bottom of the smallest column.
    for(; i < els.length; i++){
        sort(boundary);
        var el = els[i],
            minEl = boundary.pop();
        el.style.top = px(bottom(minEl) + margin('Top', el));
        el.style.left = px(x(minEl));
        boundary.push(el);
    }

    sort(boundary);
    var maxEl = boundary[0];
    container.style.height = px(bottom(maxEl) + margin('Bottom', maxEl));
}
