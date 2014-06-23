Array.prototype.peek = function() {
    // Return a random object from an array.
    var index = Math.floor(Math.random() * this.length);
    return this[index];
};

Array.prototype.shuffle = function() {
    // Uniformly shuffle an array.
    for (var i = 0; i < this.length; i++) {

        var j = Math.floor(Math.random() * (this.length - i) + i);

        var temp = this[i];
        this[i] = this[j];
        this[j] = temp;

    }
};

String.prototype.capitalise = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

var capToPercent = function(n) {
    // Return a value capped between 0 and 100 inclusive.
    if (n > 100) {
        return 100;
    }

    if (n < 0) {
        return 0;
    }

    return n;
};

var capAboveZero = function(n) {
    // Return a value capped above zero.
    if (n < 0) {
        return 0;
    }

    return n;
};

var roundAboveZero = function(n) {
    // Return a rounded value capped above zero.
    return Math.round(capAboveZero(n));
};

var percentChance = function() {
    // Return a random integer between 0 and 99 inclusive.
    return Math.floor(Math.random() * 100);
};