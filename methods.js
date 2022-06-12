
var defaultDecimals = 18;

var pi = Math.PI;

var eulerGamma = .5772156649015329;

var constants = {

  decimals: 50, precisionScale: 10n**50n,

  e: 271828182845904523536028747135266249775724709369995n,

  eulerGamma: 57721566490153286060651209008240243104215933593992n,

  ln10: 230258509299404568401799145468436420760110148862877n,

  pi: 314159265358979323846264338327950288419716939937510n

};

function getConstant( name ) {

  return constants[name] * precisionScale / constants.precisionScale;

}


// oeis.org/A000367
bernoulli2nN = [ 1n, 1n, -1n, 1n, -1n, 5n, -691n, 7n, -3617n, 43867n, -174611n, 854513n, -236364091n, 8553103n, -23749461029n, 8615841276005n, -7709321041217n, 2577687858367n, -26315271553053477373n, 2929993913841559n, -261082718496449122051n, 1520097643918070802691n, -27833269579301024235023n, 596451111593912163277961n, -5609403368997817686249127547n, 495057205241079648212477525n, -801165718135489957347924991853n, 29149963634884862421418123812691n, -2479392929313226753685415739663229n, 84483613348880041862046775994036021n, -1215233140483755572040304994079820246041491n, 12300585434086858541953039857403386151n, -106783830147866529886385444979142647942017n, 1472600022126335654051619428551932342241899101n, -78773130858718728141909149208474606244347001n, 1505381347333367003803076567377857208511438160235n, -5827954961669944110438277244641067365282488301844260429n, 34152417289221168014330073731472635186688307783087n, -24655088825935372707687196040585199904365267828865801n, 414846365575400828295179035549542073492199375372400483487n, -4603784299479457646935574969019046849794257872751288919656867n, 1677014149185145836823154509786269900207736027570253414881613n, -2024576195935290360231131160111731009989917391198090877281083932477n, 660714619417678653573847847426261496277830686653388931761996983n, -1311426488674017507995511424019311843345750275572028644296919890574047n, 1179057279021082799884123351249215083775254949669647116231545215727922535n, -1295585948207537527989427828538576749659341483719435143023316326829946247n, 1220813806579744469607301679413201203958508415202696621436215105284649447n, -211600449597266513097597728109824233673043954389060234150638733420050668349987259n, 67908260672905495624051117546403605607342195728504487509073961249992947058239n, -94598037819122125295227433069493721872702841533066936133385696204311395415197247711n ];

// oeis.org/A002445
bernoulli2nD = [ 1n, 6n, 30n, 42n, 30n, 66n, 2730n, 6n, 510n, 798n, 330n, 138n, 2730n, 6n, 870n, 14322n, 510n, 6n, 1919190n, 6n, 13530n, 1806n, 690n, 282n, 46410n, 66n, 1590n, 798n, 870n, 354n, 56786730n, 6n, 510n, 64722n, 30n, 4686n, 140100870n, 6n, 30n, 3318n, 230010n, 498n, 3404310n, 6n, 61410n, 272118n, 1410n, 6n, 4501770n, 6n, 33330n ];


var factorialCache = [ 1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800 ];


function complex( x, y=0 ) {

  if ( y === 0 && isArbitrary(x) ) y = 0n;

  return { re: x, im: y };

}

var C = complex;

function isComplex( x ) { return typeof x === 'object' && 're' in x; }


var decimals = [], precisionScale;
var arb1, arb2, onePi, twoPi, halfPi, ln10;

function setPrecisionScale( n ) {

  if ( n === 'reset' ) decimals.shift();
  else decimals.unshift( n );

  precisionScale = 10n**BigInt( decimals[0] );

  // set some commonly used constants
  arb1 = arbitrary(1);
  arb2 = 2n * arb1;
  onePi = getConstant( 'pi' );
  twoPi = 2n * onePi;
  halfPi = onePi / 2n;
  ln10 = getConstant( 'ln10' );

}

function resetPrecisionScale() { setPrecisionScale( 'reset' ); }

setPrecisionScale( defaultDecimals );

function arbitrary( x ) {

  if ( isComplex(x) ) return { re: arbitrary( x.re ), im: arbitrary( x.im ) };

  if ( isArbitrary(x) ) return Number(x) / 10**decimals[0];

  // BigInt from exponential form includes wrong digits
  // manual construction from string more accurate

  var parts = x.toExponential().split( 'e' );
  var mantissa = parts[0].replace( '.', '' );
  var digits = mantissa.length - ( mantissa[0] === '-' ? 2 : 1 )
  var padding = +parts[1] + decimals[0] - digits;

  if ( padding < 0 ) return BigInt( Math.round( x * 10**decimals[0] ) );

  return BigInt( mantissa + '0'.repeat(padding) );

}

var A = arbitrary;

function isArbitrary( x ) { return typeof x === 'bigint' || typeof x.re === 'bigint'; }


function isZero( x ) {

  if ( isComplex(x) ) return x.re === 0 && x.im === 0;
  return x === 0;

}

function isUnity( x ) {

  if ( isComplex(x) ) return x.re === 1 && x.im === 0;
  return x === 1;

}

function isReal( x ) {

  if ( isComplex(x) ) return x.im === 0;
  return true;

}

function isInteger( x ) {

  if ( isComplex(x) ) return Number.isInteger(x.re) && x.im === 0;
  return Number.isInteger(x);

}

function isPositiveInteger( x ) {

  if ( isComplex(x) ) return Number.isInteger(x.re) && x.re > 0 && x.im === 0;
  return Number.isInteger(x) && x > 0;

}

function isPositiveIntegerOrZero( x ) {

  if ( isComplex(x) ) return Number.isInteger(x.re) && x.re >= 0 && x.im === 0;
  return Number.isInteger(x) && x >= 0;

}

function isNegativeInteger( x ) {

  if ( isComplex(x) ) return Number.isInteger(x.re) && x.re < 0 && x.im === 0;
  return Number.isInteger(x) && x < 0;

}

function isNegativeIntegerOrZero( x ) {

  if ( isComplex(x) ) return Number.isInteger(x.re) && x.re <= 0 && x.im === 0;
  return Number.isInteger(x) && x <= 0;

}

function isEqualTo( x, y ) {

  if ( isComplex(x) || isComplex(y) ) {
    if ( !isComplex(x) ) x = complex(x);
    if ( !isComplex(y) ) y = complex(y);
    return x.re === y.re && x.im === y.im;
  }

  return x === y;

}


function re( x ) {

  if ( isComplex(x) ) return x.re;
  return x;

}

var real = re;

function im( x ) {

  if ( isComplex(x) ) return x.im;
  return 0;

}

var imag = im;

function abs( x ) {

  if ( isComplex(x) ) {

    if ( isArbitrary(x) ) {

      if ( x.im === 0n ) return abs(x.re);

      if ( x.re === 0n ) return abs(x.im);

      if ( abs(x.re) < abs(x.im) )

        return mul( abs(x.im), sqrt( arb1 + div( div( mul(x.re,x.re), x.im ), x.im ) ) );

      else

         return mul( abs(x.re), sqrt( arb1 + div( div( mul(x.im,x.im), x.re ), x.re ) ) );

    }

    if ( x.im === 0 ) return Math.abs(x.re);

    if ( x.re === 0 ) return Math.abs(x.im);

    if ( Math.abs(x.re) < Math.abs(x.im) )

      return Math.abs(x.im) * Math.sqrt( 1 + ( x.re / x.im )**2 );

    else

      return Math.abs(x.re) * Math.sqrt( 1 + ( x.im / x.re )**2 );

  }

  if ( isArbitrary(x) )
    if ( x < 0n ) return -x;
    else return x;

  return Math.abs(x);

}

function arg( x ) {

  // adding zero prevents unexpected behavior for -0

  if ( isComplex(x) ) return Math.atan2( x.im + 0, x.re + 0 );

  return Math.atan2( 0, x + 0 );

}


// JavaScript does not support operator overloading

function add( x, y ) {

  if ( arguments.length > 2 ) {

    var z = add( x, y );
    for ( var i = 2 ; i < arguments.length ; i++ ) z = add( z, arguments[i] );
    return z; 

  }

  if ( isComplex(x) || isComplex(y) ) {

    if ( !isComplex(x) ) x = complex(x);
    if ( !isComplex(y) ) y = complex(y);

    return { re: x.re + y.re, im: x.im + y.im };

  }

  return x + y;

}

function sub( x, y ) {

  if ( isComplex(x) || isComplex(y) ) {

    if ( !isComplex(x) ) x = complex(x);
    if ( !isComplex(y) ) y = complex(y);

    return { re: x.re - y.re, im: x.im - y.im };

  }

  return x - y;

}

function mul( x, y ) {

  if ( arguments.length > 2 ) {

    var z = mul( x, y );
    for ( var i = 2 ; i < arguments.length ; i++ ) z = mul( z, arguments[i] );
    return z; 

  }

  if ( isComplex(x) || isComplex(y) ) {

    if ( !isComplex(x) ) x = complex(x);
    if ( !isComplex(y) ) y = complex(y);

    if ( isArbitrary(x) )

      return { re: ( x.re * y.re - x.im * y.im ) / precisionScale,
               im: ( x.im * y.re + x.re * y.im ) / precisionScale };

    return { re: x.re * y.re - x.im * y.im,
             im: x.im * y.re + x.re * y.im };

  }

  if ( isArbitrary(x) ) return x * y / precisionScale;

  return x * y;

}

function neg( x ) {

  if ( isComplex(x) ) return { re: -x.re, im: -x.im };

  return -x;

}

function div( x, y ) {

  if ( isComplex(x) || isComplex(y) ) {

    if ( !isComplex(x) ) x = complex(x);
    if ( !isComplex(y) ) y = complex(y);

    if ( y.re === 0 && y.im === 0 || y.re === 0n && y.im === 0n ) // operator precedence
      throw Error( 'Division by zero' );

    if ( isArbitrary(x) ) {

      var N = { re: x.re * y.re + x.im * y.im,
                im: x.im * y.re - x.re * y.im };
      var D = y.re * y.re + y.im * y.im;

      return { re: precisionScale * N.re / D,
               im: precisionScale * N.im / D };

    }

    if ( Math.abs(y.re) < Math.abs(y.im) ) {

      var f = y.re / y.im;
      return { re: ( x.re * f + x.im ) / ( y.re * f + y.im ),
               im: ( x.im * f - x.re ) / ( y.re * f + y.im ) };

    } else {

      var f = y.im / y.re;
      return { re: ( x.re + x.im * f ) / ( y.re + y.im * f ),
               im: ( x.im - x.re * f ) / ( y.re + y.im * f ) };

    }

  }

  if ( y === 0 || y === 0n ) throw Error( 'Division by zero' );

  if ( isArbitrary(x) ) return precisionScale * x / y;

  return x / y;

}

function inv( x ) {

  if ( isArbitrary(x) ) return div( arb1, x );

  return div( 1, x );

}

function pow( x, y ) {

  if ( isArbitrary(x) || isArbitrary(y) ) {

    if ( !isArbitrary(x) ) x = arbitrary(x);
    if ( !isArbitrary(y) ) y = arbitrary(y);

    return exp( mul( y, ln(x) ) );

  }

  if ( isComplex(x) || isComplex(y) ) {

    if ( !isComplex(x) ) x = complex(x);
    if ( !isComplex(y) ) y = complex(y);

    if ( x.re === 0 && x.im === 0 && y.re > 0 )
      return complex(0);
    if ( x.re === 0 && x.im === 0 && y.re === 0 && y.im === 0 )
      return complex(1);
    if ( x.re === 0 && x.im === 0 && y.re < 0 )
      throw Error( 'Power singularity' );

    return exp( mul( y, log(x) ) );

  }

  if ( x === 0 && y < 0 ) throw Error( 'Power singularity' );

  if ( x < 0 && !Number.isInteger(y) ) return pow( complex(x), y );

  return x**y;

}

function root( x, y ) { return pow( x, div( 1, y ) ); }

function surd( x, n ) {

  if ( isComplex(x) || isComplex(n) ) throw Error( 'Surd requires real inputs' );

  if ( !isInteger(n) ) throw Error( 'Second parameter of surd must be integer' );

  if ( n & 1 ) {
    var sign = Math.sign(x); // zero at origin anyway
    return sign * root( sign*x, n );
  }

  if ( x < 0 ) throw Error( 'First parameter of surd must be positive for even integers' );

  return root( x, n );

}

function sqrt( x ) {

  if ( isComplex(x) ) {

    if ( isArbitrary(x) ) {

      if ( x.im === 0n )
        if ( x.re < 0n ) return { re: 0n, im: sqrt(-x.re) };
        else return { re: sqrt(x.re), im: 0n };

      // need evaluation independent of natural logarithm

      var c = abs(x);
      var sign = x.im < 0n ? -1n : 1n;

      return { re: sqrt( div( c + x.re, arb2 ) ), im: sign * sqrt( div( c - x.re, arb2 ) ) }

    }

    if ( x.im === 0 )
      if ( x.re < 0 ) return { re: 0, im: Math.sqrt(-x.re) };
      else return { re: Math.sqrt(x.re), im: 0 };

    // expression above suffers from rounding errors when not arbitrary,
    //   especially affecting elliptic integral of third kind

    return exp( mul( .5, log(x) ) );

  }

  if ( isArbitrary(x) ) {

    if ( x === 0n ) return 0n;

    if ( x < 0n ) throw Error( 'Cannot evaluate real square root of ' + x );

    // Brent, Modern Computer Arithmetic, SqrtInt algorithm

    var u = x, s, t;

    while ( u !== s ) {
      s = u;
      t = s + div( x, s );
      u = div( t, arb2 );
    }

    return s;

  }

  if ( x < 0 ) return { re: 0, im: Math.sqrt(-x) };

  return Math.sqrt(x);

}


function complexAverage( f, x, offset=1e-5 ) {

  return div( add( f(add(x,offset)), f(sub(x,offset)) ), 2 );

}


function complexFromString( s, returnAsString=false ) {

  var lead = '', real, imag;

  if ( s[0] === '+' || s[0] === '-' ) {
    lead = s[0];
    s = s.slice(1);
  }

  if ( s.includes('+') || s.includes('-') ) {
    if ( s.includes('+') ) {
      real = lead + s.slice( 0, s.indexOf('+') );
      imag = s.slice( s.indexOf('+') + 1, s.length - 1 );
    } else {
      real = lead + s.slice( 0, s.indexOf('-') );
      imag = s.slice( s.indexOf('-'), s.length - 1 );
    }
  } else {
    if ( s.includes('i') ) {
      real = '0';
      imag = lead + s.slice( 0, s.length - 1 );
    } else {
      real = lead + s;
      imag = '0';
    }
  }

  if ( imag === '' || imag === '-' ) imag += '1';

  if ( returnAsString ) return `{ re: ${real}, im: ${imag} }`;

  return { re: +real, im: +imag };

}

function output() {

  for ( var i = 0 ; i < arguments.length ; i++ ) console.log( arguments[i] );

}

function jacobiTheta( n, x, q, tolerance=1e-10 ) {

  if ( abs(q) >= 1 ) throw Error( 'Unsupported elliptic nome' );

  if ( ![1,2,3,4].includes(n) ) throw Error( 'Undefined Jacobi theta index' );

  if ( isComplex(x) || isComplex(q) ) {

    if ( !isComplex(x) ) x = complex(x);

    var piTau = div( log(q), complex(0,1) );

    // dlmf.nist.gov/20.2 to reduce overflow
    if ( Math.abs(x.im) > Math.abs(piTau.im) || Math.abs(x.re) > Math.PI ) {

      // use floor for consistency with fundamentalParallelogram
      var pt = Math.floor( x.im / piTau.im );
      x = sub( x, mul( pt, piTau ) );

      var p = Math.floor( x.re / Math.PI );
      x = sub( x, p * Math.PI );

      var qFactor = pow( q, -pt*pt );
      var eFactor = exp( mul( -2 * pt, x, complex(0,1) ) );

      // factors can become huge, so chop spurious parts first
      switch( n ) {

        case 1:

          return mul( (-1)**(p+pt), qFactor, eFactor, chop( jacobiTheta( n, x, q ), tolerance ) );

        case 2:

          return mul( (-1)**p, qFactor, eFactor, chop( jacobiTheta( n, x, q ), tolerance ) );

        case 3:

          return mul( qFactor, eFactor, chop( jacobiTheta( n, x, q ), tolerance ) );

        case 4:

          return mul( (-1)**pt, qFactor, eFactor, chop( jacobiTheta( n, x, q ), tolerance ) );

      }

    }

    switch( n ) {

      case 1:

        var s = complex(0);
        var p = complex(1);
        var i = 0;

        while ( Math.abs(p.re) > tolerance || Math.abs(p.im) > tolerance ) {
          p = mul( (-1)**i, pow( q, i*i+i ), sin( mul(2*i+1,x) ) );
          s = add( s, p );
          i++;
        }

        return mul( 2, pow( q, 1/4 ), s );

      case 2:

        var s = complex(0);
        var p = complex(1);
        var i = 0;

        while ( Math.abs(p.re) > tolerance || Math.abs(p.im) > tolerance ) {
          p = mul( pow( q, i*i+i ), cos( mul(2*i+1,x) ) );
          s = add( s, p );
          i++;
        }

        return mul( 2, pow( q, 1/4 ), s );

      case 3:

        var s = complex(0);
        var p = complex(1);
        var i = 1;

        while ( Math.abs(p.re) > tolerance || Math.abs(p.im) > tolerance ) {
          p = mul( pow( q, i*i ), cos( mul(2*i,x) ) );
          s = add( s, p );
          i++;
        }

        return add( 1, mul(2,s) );

      case 4:

        var s = complex(0);
        var p = complex(1);
        var i = 1;

        while ( Math.abs(p.re) > tolerance || Math.abs(p.im) > tolerance ) {
          p = mul( pow( neg(q), i*i ), cos( mul(2*i,x) ) );
          s = add( s, p );
          i++;
        }

        return add( 1, mul(2,s) );

      }

  } else {

    switch( n ) {

      case 1:

        if ( q < 0 ) return jacobiTheta( n, x, complex(q) );

        var s = 0;
        var p = 1;
        var i = 0;

        while ( Math.abs(p) > tolerance ) {
          p = (-1)**i * q**(i*i+i) * sin( (2*i+1) * x );
          s += p;
          i++;
        }

        return 2 * q**(1/4) * s;

      case 2:

        if ( q < 0 ) return jacobiTheta( n, x, complex(q) );

        var s = 0;
        var p = 1;
        var i = 0;

        while ( Math.abs(p) > tolerance ) {
          p = q**(i*i+i) * cos( (2*i+1) * x );
          s += p;
          i++;
        }

        return 2 * q**(1/4) * s;

      case 3:

        var s = 0;
        var p = 1;
        var i = 1;

        while ( Math.abs(p) > tolerance ) {
          p = q**(i*i) * cos( 2*i * x );
          s += p;
          i++;
        }

        return 1 + 2 * s;

      case 4:

        var s = 0;
        var p = 1;
        var i = 1;

        while ( Math.abs(p) > tolerance ) {
          p = (-q)**(i*i) * cos( 2*i * x );
          s += p;
          i++;
        }

        return 1 + 2 * s;

    }

  }

}


function ellipticNome( m ) {

  if ( isComplex(m) ) return exp( div( mul( -pi, ellipticK( sub(1,m) ) ), ellipticK(m) ) );

  if ( m > 1 ) return ellipticNome( complex(m) );

  if ( m < 0 ) return -exp( -pi * ellipticK( 1/(1-m) ) / ellipticK( m/(m-1) ) );

  return exp( -pi * ellipticK(1-m) / ellipticK(m) );

}

function fundamentalParallelogram( x, p1, p2 ) {

  // x = m p1 + n p2, solve for m, n

  var m = ( x.re * p2.im - x.im * p2.re ) / ( p1.re * p2.im - p1.im * p2.re );
  var n = ( x.im * p1.re - x.re * p1.im ) / ( p1.re * p2.im - p1.im * p2.re );

  return add( x, mul( -Math.floor(m), p1 ), mul( -Math.floor(n), p2 ) );

}


function sn( x, m ) {

  if ( m > 1 || isComplex(x) || isComplex(m) ) {

    if ( !isComplex(m) ) m = complex(m); // ensure K complex

    // dlmf.nist.gov/22.17
    if ( abs(m) > 1 ) return mul( inv(sqrt(m)), sn( mul(sqrt(m),x), inv(m) ) ); 

    // periods 4K, 2iK'
    var p1 = mul( 4, ellipticK(m) );
    var p2 = mul( complex(0,2), ellipticK( sub(1,m) ) );

    x = fundamentalParallelogram( x, p1, p2 );

    var q = ellipticNome(m);
    var t = div( x, pow( jacobiTheta(3,0,q), 2 ) );

    return mul( div( jacobiTheta(3,0,q), jacobiTheta(2,0,q) ),
                div( jacobiTheta(1,t,q), jacobiTheta(4,t,q) ) );

  }

  // dlmf.nist.gov/22.5.ii
  if ( m === 0 ) return sin(x);
  if ( m === 1 ) return tanh(x);

  var q = ellipticNome(m);
  var t = x / jacobiTheta(3,0,q)**2;

  if ( m < 0 )
    return jacobiTheta(3,0,q) / jacobiTheta(4,t,q)
           * div( jacobiTheta(1,t,q), jacobiTheta(2,0,q) ).re;

  return jacobiTheta(3,0,q) / jacobiTheta(2,0,q)
         * jacobiTheta(1,t,q) / jacobiTheta(4,t,q);

}

function cn( x, m ) {

  if ( m > 1 || isComplex(x) || isComplex(m) ) {

    if ( !isComplex(m) ) m = complex(m); // ensure K complex

    // dlmf.nist.gov/22.17
    if ( abs(m) > 1 ) return dn( mul(sqrt(m),x), inv(m) ); 

    // periods 4K, 2K + 2iK'
    var p1 = mul( 4, ellipticK(m) );
    var p2 = add( div(p1,2), mul( complex(0,2), ellipticK( sub(1,m) ) ) );

    x = fundamentalParallelogram( x, p1, p2 );

    var q = ellipticNome(m);
    var t = div( x, pow( jacobiTheta(3,0,q), 2 ) );

    return mul( div( jacobiTheta(4,0,q), jacobiTheta(2,0,q) ),
                div( jacobiTheta(2,t,q), jacobiTheta(4,t,q) ) );

  }

  // dlmf.nist.gov/22.5.ii
  if ( m === 0 ) return cos(x);
  if ( m === 1 ) return sech(x);

  var q = ellipticNome(m);
  var t = x / jacobiTheta(3,0,q)**2;

  if ( m < 0 )
    return jacobiTheta(4,0,q) / jacobiTheta(4,t,q)
           * div( jacobiTheta(2,t,q), jacobiTheta(2,0,q) ).re;

  return jacobiTheta(4,0,q) / jacobiTheta(2,0,q)
         * jacobiTheta(2,t,q) / jacobiTheta(4,t,q);

}

function dn( x, m ) {

  if ( m > 1 || isComplex(x) || isComplex(m) ) {

    if ( !isComplex(m) ) m = complex(m); // ensure K complex

    // dlmf.nist.gov/22.17
    if ( abs(m) > 1 ) return cn( mul(sqrt(m),x), inv(m) ); 

    // periods 2K, 4iK'
    var p1 = mul( 2, ellipticK(m) );
    var p2 = mul( complex(0,4), ellipticK( sub(1,m) ) );

    x = fundamentalParallelogram( x, p1, p2 );

    var q = ellipticNome(m);
    var t = div( x, pow( jacobiTheta(3,0,q), 2 ) );

    return mul( div( jacobiTheta(4,0,q), jacobiTheta(3,0,q) ),
                div( jacobiTheta(3,t,q), jacobiTheta(4,t,q) ) );

  }

  // dlmf.nist.gov/22.5.ii
  if ( m === 0 ) return 1;
  if ( m === 1 ) return sech(x);

  var q = ellipticNome(m);
  var t = x / jacobiTheta(3,0,q)**2;

  return jacobiTheta(4,0,q) / jacobiTheta(3,0,q)
         * jacobiTheta(3,t,q) / jacobiTheta(4,t,q);

}

function am( x, m ) {

  if ( m > 1 || isComplex(x) || isComplex(m) ) {

    if ( !isComplex(x) ) x = complex(x);
    if ( !isComplex(m) ) m = complex(m);

    if ( m.im === 0 && m.re <= 1 ) {

      var K = ellipticK( m.re );
      var n = Math.round( x.re / 2 / K );
      x = sub( x, 2 * n * K );

      if ( m.re < 0 ) {

        var Kp = ellipticK( 1 - m.re );
        var p = Math.round( x.im / 2 / Kp.re );

        // bitwise test for odd integer
        if ( p & 1 ) return sub( n * pi, arcsin( sn(x,m) ) );

      }

      return add( arcsin( sn(x,m) ), n * pi );

    }

    return arcsin( sn(x,m) );

  } else {

    var K = ellipticK(m);
    var n = Math.round( x / 2 / K );
    x = x - 2 * n * K;

    return Math.asin( sn(x,m) ) + n * pi;

  }

}


function weierstrassRoots(g2, g3) {

  function cubicTrigSolution(p, q, n) {

    // p, q both negative in defining cubic
    if (p == 0) {
      return mul(root(q, 3), exp(complex(0, 2 * pi * n / 3)))
    } else {
      return mul(2 / sqrt(3), sqrt(p),
        cos(sub(div(arccos(mul(3 * sqrt(3) / 2, q, pow(p, -3 / 2))), 3),
          2 * pi * n / 3)));
    }
  }

  g2 = div( g2, 4 );
  g3 = div( g3, 4 );

  var e1 = cubicTrigSolution( g2, g3, 0 );
  var e2 = cubicTrigSolution( g2, g3, 1 );
  var e3 = cubicTrigSolution( g2, g3, 2 );
  return [ e1, e2, e3 ];

}

function weierstrassHalfPeriods( g2, g3 ) {

  // Davis, Intro to Nonlinear Diff. & Integral Eqs., pp.157-8
  // consistent with periods of Jacobi sine in weierstrassP
  // not consistent with Mathematica

  var [ e1, e2, e3 ] = weierstrassRoots( g2, g3 );

  var lambda = sqrt( sub(e1,e3) );
  var m = div( sub(e2,e3), sub(e1,e3) );

  var w1 = div( ellipticK(m), lambda );
  var w3 = div( mul( complex(0,1), ellipticK( sub(1,m) ) ), lambda );

  return [ w1, w3 ];

}

function weierstrassInvariants( w1, w3 ) {

  if ( !isComplex(w1) ) w1 = complex(w1);
  if ( !isComplex(w3) ) w3 = complex(w3);

  // order half periods by complex slope
  if ( w3.im/w3.re < w1.im/w1.re ) [ w1, w3 ] = [ w3, w1 ];

  var ratio =  div( w3, w1 ), conjugate;

  if ( ratio.im < 0 ) {
    ratio.im = -ratio.im;
    conjugate = true;
  }

  var q = exp( mul( complex(0,1), pi, ratio ) );

  // en.wikipedia.org/wiki/Weierstrass's_elliptic_functions
  // modified for input of half periods

  var a = jacobiTheta( 2, 0, q );
  var b = jacobiTheta( 3, 0, q );

  var g2 = mul( 4/3*pi**4, pow( mul(2,w1), -4 ),
                add( pow(a,8), mul( -1, pow(a,4), pow(b,4) ), pow(b,8) ) );

  var g3 = mul( 8/27*pi**6, pow( mul(2,w1), -6 ),
                add( pow(a,12), mul( -3/2, pow(a,8), pow(b,4) ),
                                mul( -3/2, pow(a,4), pow(b,8) ), pow(b,12) ) );

  if ( conjugate ) {
    g2.im = -g2.im;
    g3.im = -g3.im;
  }

  return [ g2, g3 ];

}


function weierstrassP( x, g2, g3 ) {

  if ( !isComplex(x) ) x = complex(x);

  var [ e1, e2, e3 ] = weierstrassRoots( g2, g3 );

  // Whittaker & Watson, Section 22.351

  var m = div( sub(e2,e3), sub(e1,e3) );

  return add( e3, mul( sub(e1,e3), pow( sn( mul( x, sqrt(sub(e1,e3)) ), m ), -2 ) ) );

}

function weierstrassPPrime( x, g2, g3 ) {

  if ( !isComplex(x) ) x = complex(x);

  var [ e1, e2, e3 ] = weierstrassRoots( g2, g3 );

  // Whittaker & Watson, Section 22.351

  var m = div( sub(e2,e3), sub(e1,e3) );

  var argument = mul( x, sqrt(sub(e1,e3)) );

  return mul( -2, pow( sub(e1,e3), 3/2 ), cn( argument, m ), dn( argument, m ),
              pow( sn( argument, m ), -3 ) );

}

function inverseWeierstrassP( x, g2, g3 ) {

  if ( !isComplex(x) ) x = complex(x);

  var [ e1, e2, e3 ] = weierstrassRoots( g2, g3 );

  // Johansson arxiv.org/pdf/1806.06725.pdf p.17
  // sign of imaginary part on real axis differs from Mathematica

  return carlsonRF( sub(x,e1), sub(x,e2), sub(x,e3) );

}

function kleinJ( x ) {

  // from mpmath / elliptic.py

  var q = exp( mul( complex(0,pi), x ) );
  var t2 = chop( jacobiTheta(2,0,q) );
  var t3 = chop( jacobiTheta(3,0,q) );
  var t4 = chop( jacobiTheta(4,0,q) );
  var P = pow( add( pow(t2,8), pow(t3,8), pow(t4,8) ), 3 );
  var Q = mul( 54, pow( mul(t2,t3,t4), 8 ) );

  return div( P, Q );

}


// Carlson symmetric integrals

function carlsonRC( x, y ) {

  if ( x < 0 || y < 0 || isComplex(x) || isComplex(y) ) {

    if ( !isComplex(x) ) x = complex(x);
    if ( !isComplex(y) ) y = complex(y);

    if ( x.re === y.re && x.im === y.im ) return inv( sqrt(x) );

    // return value by continuity

    return div( arccos( div( sqrt(x), sqrt(y) ) ), mul( sqrt(y), sqrt( sub( 1, div(x,y) ) ) ) );

  }

  if ( x === y ) return 1 / Math.sqrt(x);

  if ( x < y ) return Math.acos( Math.sqrt(x/y) ) / Math.sqrt(y-x);

  return Math.acosh( Math.sqrt(x/y) ) / Math.sqrt(x-y);

}

function carlsonRD( x, y, z ) {

  return carlsonRJ( x, y, z, z );

}

function carlsonRF( x, y, z, tolerance=1e-10 ) {

  if ( isComplex(x) || isComplex(y) || isComplex(z) ) {

    var xm = x;
    var ym = y;
    var zm = z;

    var Am = A0 = div( add( x, y, z ), 3 );
    var Q = Math.pow( 3*tolerance, -1/6 )
            * Math.max( abs( sub(A0,x) ), abs( sub(A0,y) ), abs( sub(A0,z) ) );
    var g = .25;
    var pow4 = 1;

    while ( true ) {
      var xs = sqrt(xm);
      var ys = sqrt(ym);
      var zs = sqrt(zm);
      var lm = add( mul(xs,ys), mul(xs,zs), mul(ys,zs) );
      var Am1 = mul( add(Am,lm), g );
      xm = mul( add(xm,lm), g );
      ym = mul( add(ym,lm), g );
      zm = mul( add(zm,lm), g );
      if ( pow4 * Q < abs(Am) ) break;
      Am = Am1;
      pow4 *= g;
    }

    var t = div( pow4, Am );
    var X = mul( sub(A0,x), t );
    var Y = mul( sub(A0,y), t );
    var Z = neg( add(X,Y) );
    var E2 = sub( mul(X,Y), mul(Z,Z) );
    var E3 = mul(X,Y,Z);

    return mul( pow( Am, -.5 ),
             add( 9240, mul(-924,E2), mul(385,E2,E2), mul(660,E3), mul(-630,E2,E3) ), 1/9240 );

  } else {

    if ( y === z ) return carlsonRC( x, y );
    if ( x === z ) return carlsonRC( y, x );
    if ( x === y ) return carlsonRC( z, x );

    if ( x < 0 || y < 0 || z < 0 ) return carlsonRF( complex(x), y, z );

    // adapted from mpmath / elliptic.py

    var xm = x;
    var ym = y;
    var zm = z;

    var Am = A0 = (x + y + z) / 3;
    var Q = Math.pow( 3*tolerance, -1/6 )
            * Math.max( Math.abs(A0-x), Math.abs(A0-y), Math.abs(A0-z) );
    var g = .25;
    var pow4 = 1;

    while ( true ) {
      var xs = Math.sqrt(xm);
      var ys = Math.sqrt(ym);
      var zs = Math.sqrt(zm);
      var lm = xs*ys + xs*zs + ys*zs;
      var Am1 = (Am + lm) * g;
      xm = (xm + lm) * g;
      ym = (ym + lm) * g;
      zm = (zm + lm) * g;
      if ( pow4 * Q < Math.abs(Am) ) break;
      Am = Am1;
      pow4 *= g;
    }

    var t = pow4 / Am;
    var X = (A0-x) * t;
    var Y = (A0-y) * t;
    var Z = -X-Y;
    var E2 = X*Y - Z**2;
    var E3 = X*Y*Z;

    return Math.pow( Am, -.5 )
           * ( 9240 - 924*E2 + 385*E2**2 + 660*E3 - 630*E2*E3 ) / 9240;

  }

}

function carlsonRG( x, y, z ) {

  var t1 = mul( z, carlsonRF(x,y,z) );
  var t2 = mul( -1/3, sub(x,z), sub(y,z), carlsonRD(x,y,z) );
  var t3 = sqrt( mul( x, y, inv(z) ) );

  return mul( .5, add( t1, t2, t3 ) );

}

function carlsonRJ( x, y, z, p, tolerance=1e-10 ) {

  if ( isComplex(x) || isComplex(y) || isComplex(z) || isComplex(p) ) {

    var xm = x;
    var ym = y;
    var zm = z;
    var pm = p;

    var A0 = Am = div( add( x, y, z, mul(2,p) ), 5 );
    var delta = mul( sub(p,x), sub(p,y), sub(p,z) );
    var Q = Math.pow( .25*tolerance, -1/6 )
            * Math.max( abs( sub(A0,x) ), abs( sub(A0,y) ), abs( sub(A0,z) ), abs( sub(A0,p) ) );
    var g = .25;
    var pow4 = 1;
    var S = complex(0);

    while ( true ) {
      var sx = sqrt(xm);
      var sy = sqrt(ym);
      var sz = sqrt(zm);
      var sp = sqrt(pm);
      var lm = add( mul(sx,sy), mul(sx,sz), mul(sy,sz) );
      var Am1 = mul( add(Am,lm), g );
      xm = mul( add(xm,lm), g );
      ym = mul( add(ym,lm), g );
      zm = mul( add(zm,lm), g );
      pm = mul( add(pm,lm), g );
      var dm = mul( add(sp,sx), add(sp,sy), add(sp,sz) );
      var em = mul( delta, pow4**3, inv(dm), inv(dm) );
      if ( pow4 * Q < abs(Am) ) break;
      var T = mul( carlsonRC( 1, add(1,em) ), pow4, inv(dm) );
      S = add( S, T );
      pow4 *= g;
      Am = Am1;
    }

    var t = div( pow4, Am );
    var X = mul( sub(A0,x), t );
    var Y = mul( sub(A0,y), t );
    var Z = mul( sub(A0,z), t );
    var P = div( add(X,Y,Z), -2 );
    var E2 = add( mul(X,Y), mul(X,Z), mul(Y,Z), mul(-3,P,P) );
    var E3 = add( mul(X,Y,Z), mul(2,E2,P), mul(4,P,P,P) );
    var E4 = mul( add( mul(2,X,Y,Z), mul(E2,P), mul(3,P,P,P) ), P );
    var E5 = mul(X,Y,Z,P,P);
    P = add( 24024, mul(-5148,E2), mul(2457,E2,E2), mul(4004,E3), mul(-4158,E2,E3), mul(-3276,E4), mul(2772,E5) );
    var v1 = mul( pow4, pow( Am, -1.5 ), P, 1/24024 );
    var v2 = mul(6,S);

    return add( v1, v2 );

  } else {

    if ( x < 0 || y < 0 || z < 0 || p < 0 ) return carlsonRJ( complex(x), y, z, p );

    // adapted from mpmath / elliptic.py

    var xm = x;
    var ym = y;
    var zm = z;
    var pm = p;

    var A0 = Am = (x + y + z + 2*p) / 5;
    var delta = (p-x) * (p-y) * (p-z);
    var Q = Math.pow( .25*tolerance, -1/6 )
            * Math.max( Math.abs(A0-x), Math.abs(A0-y), Math.abs(A0-z), Math.abs(A0-p) );
    var g = .25;
    var pow4 = 1;
    var S = 0;

    while ( true ) {
      var sx = Math.sqrt(xm);
      var sy = Math.sqrt(ym);
      var sz = Math.sqrt(zm);
      var sp = Math.sqrt(pm);
      var lm = sx*sy + sx*sz + sy*sz;
      var Am1 = (Am + lm) * g;
      xm = (xm + lm) * g;
      ym = (ym + lm) * g;
      zm = (zm + lm) * g;
      pm = (pm + lm) * g;
      var dm = (sp+sx) * (sp+sy) * (sp+sz);
      var em = delta * pow4**3 / dm**2;
      if ( pow4 * Q < Math.abs(Am) ) break;
      var T = carlsonRC( 1, 1 + em ) * pow4 / dm;
      S += T;
      pow4 *= g;
      Am = Am1;
    }

    var t = pow4 / Am;
    var X = (A0-x) * t;
    var Y = (A0-y) * t;
    var Z = (A0-z) * t;
    var P = (-X-Y-Z) / 2;
    var E2 = X*Y + X*Z + Y*Z - 3*P**2;
    var E3 = X*Y*Z + 2*E2*P + 4*P**3;
    var E4 = ( 2*X*Y*Z + E2*P + 3*P**3 ) * P;
    var E5 = X*Y*Z*P**2;
    P = 24024 - 5148*E2 + 2457*E2**2 + 4004*E3 - 4158*E2*E3 - 3276*E4 + 2772*E5;
    var v1 = pow4 * Math.pow( Am, -1.5 ) * P / 24024;
    var v2 = 6*S;

    return v1 + v2;

  }

}

function logGamma( x ) {

  if ( isArbitrary(x) ) {

    var useAsymptotic = 10n * arb1;

    if ( isNegativeIntegerOrZero( arbitrary(x) ) ) throw Error( 'Gamma function pole' );

    if ( abs(x) < useAsymptotic ) {

      // slightly faster to get smaller integer near transition circle
      var xRe = isComplex(x) ? x.re : x;
      var n = Math.ceil( arbitrary(useAsymptotic) - arbitrary(xRe) );

      // ln(pochhammer(x,n))
      var lnPochhammer = ln(x), current = arb1, count = 1;

      while ( count < n ) {
        lnPochhammer = add( lnPochhammer, ln( add( x, current ) ) );
        current = add( current, arb1 );
        count++;
      }

      return sub( logGamma(add(x,arbitrary(n))), lnPochhammer );

    }

    if ( x < 0n ) x = complex(x);

    // reflection formula with non-Hare correction to imaginary part
    if ( x.re < 0n ) {

      // expand sine as exponentials for more accurate result
      var t, e, p, k = arb1;

      if ( abs(x.im) === 0 ) {

        t = neg( ln( sin( mul( x, onePi ) ) ) );

      } else if ( x.im < 0n ) {

        e = exp( mul( x, complex(0n,-twoPi) ) );
        p = complex( e.re, e.im );
        t = complex( e.re, e.im );
        while ( p.re !== 0n || p.im !== 0n ) {
          k += arb1;
          p = mul( p, e );
          t = add( t, div( p, k ) );
        }
        t = add( t, mul( x, complex(0n,-onePi) ), ln(arb2) );

      } else {

        e = exp( mul( x, complex(0n,twoPi) ) );
        p = complex( e.re, e.im );
        t = complex( e.re, e.im );
        while ( p.re !== 0n || p.im !== 0n ) {
          k += arb1;
          p = mul( p, e );
          t = add( t, div( p, k ) );
        }
        t = add( t, mul( x, complex(0n,onePi) ), complex(0n,-onePi), ln(arb2) );

      }

      return add( t, ln(onePi), neg( logGamma( sub(arb1,x) ) ), complex(0n,halfPi) );

    }

    // Johansson arxiv.org/abs/2109.08392

    var k = 1, K = arb1, y, p = 1n, s = 0n;

    if ( isComplex(x) ) {
      function compare() { return p.re !== 0n || p.im !== 0n; };
      y = complex( x.re, x.im );
    } else {
      function compare() { return p !== 0n; };
      y = x;
    }

    while ( compare() ) {

      if ( k === bernoulli2nN.length ) {
        console.log( 'Not enough Bernoulli numbers for logGamma' );
        break;
      }

      p = div( div( bernoulli2nN[k], bernoulli2nD[k] ),
               mul( K+arb1, K, y ) );
      s = add( s, p );

      y = mul( y, x, x );
      K += arb2;
      k++;

    }

    return add( mul( sub(x,arb1/2n), ln(x) ), neg(x), div(ln(twoPi),arb2), s );

  }

  // log of gamma less likely to overflow than gamma
  // Lanczos approximation as evaluated by Paul Godfrey

  var c = [ 57.1562356658629235, -59.5979603554754912, 14.1360979747417471,
            -.491913816097620199, .339946499848118887e-4, .465236289270485756e-4,
            -.983744753048795646e-4, .158088703224912494e-3, -.210264441724104883e-3,
            .217439618115212643e-3, -.164318106536763890e-3, .844182239838527433e-4,
            -.261908384015814087e-4, .368991826595316234e-5 ];

  if ( isNegativeIntegerOrZero(x) ) throw Error( 'Gamma function pole' );

  if ( isComplex(x) ) {

    // reflection formula with modified Hare correction to imaginary part
    if ( x.re < 0 ) {

      var logRatio = log( div( pi, sin( mul(pi,x) ) ) );
      // rounding errors can lead to wrong side of branch point
      if ( isNegativeIntegerOrZero( ( x.re + .5 ) / 2 ) )
        logRatio.im = pi * ( x.im > 0 ? 1 : -1 ); // avoid Math.sign(0) = 0

      var t = sub( logRatio, logGamma( sub(1,x) ) );
      var s = x.im < 0 ? -1 : 1;
      var d = x.im === 0 ? 1/4 : 0;
      var k = Math.ceil( x.re/2 - 3/4 + d );

      return add( t, complex( 0, 2*s*k*pi ) );

    }

    var t = add( x, 5.24218750000000000 );
    t = sub( mul( add( x, .5 ), log(t)), t );
    var s = .999999999999997092;
    for ( var j = 0 ; j < 14 ; j++ ) s = add( s, div( c[j], add( x, j+1 ) ) );
    var u = add( t, log( mul( 2.5066282746310005, div( s, x ) ) ) );

    // adjustment to keep imaginary part on same sheet
    if ( s.re < 0 ) {
      if( x.im < 0 && div(s,x).im < 0 ) u = add( u, complex(0,2*pi) );
      if( x.im > 0 && div(s,x).im > 0 ) u = add( u, complex(0,-2*pi) );
    }

    return u;

  } else {

    if ( x < 0 ) return logGamma( complex(x) ); 

    var t = x + 5.24218750000000000;
    t = ( x + .5 ) * log(t) - t;
    var s = .999999999999997092;
    for ( var j = 0 ; j < 14 ; j++ ) s += c[j] / (x+j+1);
    return t + log( 2.5066282746310005 * s / x );

  }

}

function gamma( x, y, z ) {

  if ( arguments.length === 2 ) {

    if ( isZero(x) ) {

      if ( isZero(y) ) throw Error( 'Gamma function pole' );

      var result = neg( expIntegralEi( neg(y), true ) );

      // complex on negative real axis
      if ( y < 0 || y.re < 0 && y.im === 0 ) result = sub( result, complex(0,pi) );

      return result;

    }

    // dlmf.nist.gov/8.4.15
    if ( isNegativeInteger(x) ) {

      var n = isComplex(x) ? -x.re : -x;
      var s = inv(y), p = s; // mul returns new object

      for ( var k = 1 ; k < n ; k++ ) {
        p = mul( p, -k, inv(y) );
        s = add( s, p );
      }

      var t = mul( exp(neg(y)), s );

      // dlmf.nist.gov/8.4.4
      var result = sub( neg( expIntegralEi( neg(y), true, 1e-14 ) ), t )

      // complex on negative real axis
      if ( y < 0 || y.re < 0 && y.im === 0 ) result = sub( result, complex(0,pi) );

      result = mul( (-1)**n/factorial(n), result );

      if ( isComplex(x) && !isComplex(result) ) return complex(result); // complex in, complex out

      return result;

    }

    return mul( exp(neg(y)), hypergeometricU( sub(1,x), sub(1,x), y ) );

  }

  if ( arguments.length === 3 ) {

    if ( !isZero(y) ) return sub( gamma(x,0,z), gamma(x,0,y) );

    return mul( pow(z,x), inv(x), hypergeometric1F1( x, add(x,1), neg(z) ) );

  }

  if ( isPositiveInteger(x) ) return factorial( sub(x,1) );

  // logGamma complex on negative axis
  if ( !isComplex(x) && x < 0 ) return exp( logGamma( complex(x) ) ).re;

  return exp( logGamma(x) );

}

function gammaRegularized( x, y, z ) {

  if ( arguments.length === 3 ) return div( gamma(x,y,z), gamma(x) );

  return div( gamma(x,y), gamma(x) );

}

function beta( x, y, z, w ) {

  if ( arguments.length === 4 )

    return sub( beta(y,z,w), beta(x,z,w) );

  if ( arguments.length === 3 )

    return mul( pow(x,y), inv(y), hypergeometric2F1( y, sub(1,z), add(y,1), x ) );

  return div( mul( gamma(x), gamma(y) ), gamma( add(x,y) ) ); 

}

function betaRegularized( x, y, z, w ) {

  if ( arguments.length === 4 )

    return div( beta(x,y,z,w), beta(z,w) );

  return div( beta(x,y,z), beta(y,z) );

}

// elliptic integrals

function ellipticF( x, m ) {

  if ( arguments.length === 1 ) {
    m = x;
    x = pi/2;
  }

  if ( isComplex(x) || isComplex(m) ) {

    if ( !isComplex(x) ) x = complex(x);

    var period = complex(0);
    if ( Math.abs(x.re) > pi/2 ) {
      var p = Math.round( x.re / pi );
      x.re = x.re - p * pi;
      period = mul( 2 * p, ellipticK( m ) );
    }

    return add( mul( sin(x), carlsonRF( mul(cos(x),cos(x)), sub( 1, mul(m,sin(x),sin(x)) ), 1 ) ), period );

  } else {

    if ( m > 1 && Math.abs(x) > Math.asin( 1 / Math.sqrt(m) ) ) return ellipticF( complex(x), m );

    var period = 0;
    if ( Math.abs(x) > pi/2 ) {
      var p = Math.round( x / pi );
      x = x - p * pi;
      period = 2 * p * ellipticK( m );
    }

    return sin(x) * carlsonRF( cos(x)**2, 1 - m * sin(x)**2, 1 ) + period;

  }

}

function ellipticK( m ) {

  return ellipticF( m );

}

function ellipticE( x, m ) {

  if ( arguments.length === 1 ) {
    m = x;
    x = pi/2;
  }

  if ( isComplex(x) || isComplex(m) ) {

    if ( !isComplex(x) ) x = complex(x);

    var period = complex(0);
    if ( Math.abs(x.re) > pi/2 ) {
      var p = Math.round( x.re / pi );
      x.re = x.re - p * pi;
      period = mul( 2 * p,  ellipticE( m ) );
    }

    return add( mul( sin(x), carlsonRF( mul(cos(x),cos(x)), sub( 1, mul(m,sin(x),sin(x)) ), 1 ) ),
                mul( -1/3, m, pow(sin(x),3), carlsonRD( mul(cos(x),cos(x)), sub( 1, mul(m,sin(x),sin(x)) ), 1 ) ),
                period );

  } else {

    if ( m > 1 && Math.abs(x) > Math.asin( 1 / Math.sqrt(m) ) ) return ellipticE( complex(x), m );

    var period = 0;
    if ( Math.abs(x) > pi/2 ) {
      var p = Math.round( x / pi );
      x = x - p * pi;
      period = 2 * p * ellipticE( m );
    }

    return sin(x) * carlsonRF( cos(x)**2, 1 - m * sin(x)**2, 1 )
           - m / 3 * sin(x)**3 * carlsonRD( cos(x)**2, 1 - m * sin(x)**2, 1 )
           + period;

  }

}

function ellipticPi( n, x, m ) {

  if ( arguments.length === 2 ) {
    m = x;
    x = pi/2;
  }

  // x outside period and abs(n)>1 agrees with mpmath, differs from Mathematica

  if ( isComplex(n) || isComplex(x) || isComplex(m) ) {

    if ( !isComplex(x) ) x = complex(x);

    var period = complex(0);
    if ( Math.abs(x.re) > pi/2 ) {
      var p = Math.round( x.re / pi );
      x.re = x.re - p * pi;
      period = mul( 2 * p, ellipticPi( n, m ) );
    }

    return add( mul( sin(x), carlsonRF( mul(cos(x),cos(x)), sub( 1, mul(m,sin(x),sin(x)) ), 1 ) ),
                mul( 1/3, n, pow(sin(x),3),
                  carlsonRJ( mul(cos(x),cos(x)), sub( 1, mul(m,sin(x),sin(x)) ), 1,
                                 sub( 1, mul(n,sin(x),sin(x)) ) ) ),
                period );

  } else {

    if ( n > 1 && Math.abs(x) > Math.asin( 1 / Math.sqrt(n) ) ) return ellipticPi( n, complex(x), m );

    if ( m > 1 && Math.abs(x) > Math.asin( 1 / Math.sqrt(m) ) ) return ellipticPi( n, complex(x), m );

    var period = 0;
    if ( Math.abs(x) > pi/2 ) {
      var p = Math.round( x / pi );
      x = x - p * pi;
      period = 2 * p * ellipticPi( n, m );
    }

    return sin(x) * carlsonRF( cos(x)**2, 1 - m * sin(x)**2, 1 )
           + n / 3 * sin(x)**3
             * carlsonRJ( cos(x)**2, 1 - m * sin(x)**2, 1, 1 - n * sin(x)**2 )
           + period;

  }

}

function exp( x ) {

  if ( isArbitrary(x) ) {

    if ( isComplex(x) ) {

      var expXre = exp(x.re);

      return { re: mul( expXre, cos(x.im) ),
               im: mul( expXre, sin(x.im) ) };

    }

    var m = div( x, ln10 ) / precisionScale;

    x -= m * ln10;

    // direct sum faster than function inversion
    var s = arb1;
    var p = arb1;
    var i = arb1;

    while ( p !== 0n ) {
      p = div( mul( p, x ), i );
      s += p;
      i += arb1;
    }

    if ( m > 0n ) s *= 10n**m;
    if ( m < 0n ) s /= 10n**-m; // value approaches zero for fixed decimals

    // could also return as mantissa/exponent
    return s;

  }

  if ( isComplex(x) )

    return { re: Math.exp(x.re) * Math.cos(x.im),
             im: Math.exp(x.re) * Math.sin(x.im) };

  return Math.exp(x);

}


function log( x, base ) {

  if ( isComplex(x) ) {

    if ( isComplex(base) ) return div( log(x), log(base) );

    return { re: log( abs(x), base ), im: log( Math.E, base ) * arg(x) };

  }

  if ( x < 0 ) return log( complex(x), base );

  if ( base === undefined ) return Math.log(x);

  return Math.log(x) / Math.log(base);

}

function ln( x ) {

  // Brent, Modern Computer Arithmetic, second AGM algorithm

  function arbitraryAGM( x, y ) {

    var t, u;

    if ( isComplex(x) ) {

      var maxIter = 20, i = 0;

      while( x.re !== y.re || x.im !== y.im ) {
        t = x, u = y;
        x = div( add( t, u ), arb2 );
        y = sqrt( mul( t, u ) );
        i++;
        if ( i > maxIter ) break; // convergence on complex plane not assured...
      }

    } else {

      while( x !== y ) {
        t = x, u = y;
        x = div( t + u, arb2 );
        y = sqrt( mul( t, u ) );
      }

    }

    return x;

  }

  function arbitraryTheta2( x ) {

    var p = mul( arb2, x );
    var s = p;
    var i = 1;

    if ( isComplex(x) ) {

      while ( p.re !== 0n || p.im !== 0n ) {
        for ( var j = 0 ; j < 8*i ; j++ ) p = mul( p, x );
        s = add( s, p );
        i++;
      }

    } else {

      while ( p !== 0n ) {
        for ( var j = 0 ; j < 8*i ; j++ ) p = mul( p, x );
        s = s + p;
        i++;
      }

    }

    return s;

  }

  function arbitraryTheta3( x ) {

    var p = arb2;
    var s = arb1;
    var i = 1;

    if ( isComplex(x) ) {

      while ( p.re !== 0n || p.im !== 0n ) {
        for ( var j = 0 ; j < 4*(2*i-1) ; j++ ) p = mul( p, x );
        s = add( s, p );
        i++;
      }

    } else {

      while ( p !== 0n ) {
        for ( var j = 0 ; j < 4*(2*i-1) ; j++ ) p = mul( p, x );
        s = s + p;
        i++;
      }

    }

    return s;

  }

  if ( isArbitrary(x) ) {

    if ( !isComplex(x) ) {

      if ( x < 0n ) return { re: ln( -x ), im: getConstant( 'pi' ) };

      if ( x === arb1 ) return 0n;

      if ( x < arb1 ) return -ln( div( arb1, x ) );

    }

    if ( abs(x) < arb1 ) return neg( ln( div( arb1, x ) ) );

    x = div( arb1, x );

    var t2 = arbitraryTheta2(x);
    var t3 = arbitraryTheta3(x);

    var result = div( onePi, mul( arbitrary(4), arbitraryAGM( mul(t2,t2), mul(t3,t3) ) ) );

    // adjust imaginary part
    if ( x.re < 0n ) {
      if ( result.im > 0n ) result.im -= onePi;
      else result.im += onePi;
    }

    return result;

  }

  return log(x);

}

function chop( x, tolerance=1e-10 ) {

  if ( Array.isArray(x) ) {
    var v = vector( x.length );
    for ( var i = 0 ; i < x.length ; i++ ) v[i] = chop( x[i] );
    return v;
  }

  if ( isComplex(x) ) return complex( chop(x.re), chop(x.im) );

  if ( Math.abs(x) < tolerance ) x = 0;

  return x;

}

function round( x, y ) {

  if ( arguments.length === 2 ) return mul( y, round( div(x,y) ) );

  if ( isComplex(x) ) return complex( Math.round(x.re), Math.round(x.im) );

  return Math.round(x);

}

function ceiling( x ) {

  if ( isComplex(x) ) return complex( Math.ceil(x.re), Math.ceil(x.im) );

  return Math.ceil(x);

}

function floor( x ) {

  if ( isComplex(x) ) return complex( Math.floor(x.re), Math.floor(x.im) );

  return Math.floor(x);

}

function sign( x ) {

  if ( isZero(x) ) return x;

  return div( x, abs(x) );

}

function integerPart( x ) {

  if ( isComplex(x) ) return complex( Math.trunc(x.re), Math.trunc(x.im) );

  return Math.trunc(x);

}

function fractionalPart( x ) { return sub( x, integerPart(x) ); }

// complex circular functions

function sin( x ) {

  if ( isArbitrary(x) ) {

    if ( isComplex(x) )

      return { re: mul( sin(x.re), cosh(x.im) ),
               im: mul( cos(x.re), sinh(x.im) ) };

    x = x % twoPi;

    // reduce to [-pi/2,pi/2] with successive reductions
    if ( x > halfPi ) return sin( onePi - x );
    if ( x < -halfPi ) return sin( -onePi - x );

    var s = x;
    var p = x;
    var i = arb2;

    while ( p !== 0n ) {
      p = div( mul( p, -arb1, x, x ), mul( i, i + arb1 ) );
      s += p;
      i += arb2;
    }

    return s;

  }

  if ( isComplex(x) )

    return { re: Math.sin(x.re) * Math.cosh(x.im),
             im: Math.cos(x.re) * Math.sinh(x.im) };

  return Math.sin(x);

}

function cos( x ) {

  if ( isArbitrary(x) ) {

    if ( isComplex(x) )

      return { re: mul( cos(x.re), cosh(x.im) ),
               im: -mul( sin(x.re), sinh(x.im) ) };

    x = x % twoPi;

    // reduce to [-pi/2,pi/2] with successive reductions
    if ( x > halfPi ) return -cos( onePi - x );
    if ( x < -halfPi ) return -cos( -onePi - x );

    var s = arb1;
    var p = arb1;
    var i = arb1;

    while ( p !== 0n ) {
      p = div( mul( p, -arb1, x, x ), mul( i, i + arb1 ) );
      s += p;
      i += arb2;
    }

    return s;

  }

  if ( isComplex(x) )

    return { re: Math.cos(x.re) * Math.cosh(x.im),
             im: -Math.sin(x.re) * Math.sinh(x.im) };

  return Math.cos(x);

}

function tan( x ) {

  if ( isComplex(x) ) return div( sin(x), cos(x) );

  return Math.tan(x);

 }

function cot( x ) {

  if ( isComplex(x) ) return div( cos(x), sin(x) );

  return 1 / Math.tan(x);

}

function sec( x ) {

  if ( isComplex(x) ) return div( 1, cos(x) );

  return 1 / Math.cos(x);

}

function csc( x ) {

  if ( isComplex(x) ) return div( 1, sin(x) );

  return 1 / Math.sin(x);

}


// inverse circular functions

function arcsin( x ) {

  if ( isComplex(x) ) {

    var s = sqrt( sub( 1, mul( x, x ) ) );
    s = add( mul( complex(0,1), x ), s ); 
    return mul( complex(0,-1), log( s ) );

  }

  if ( Math.abs(x) <= 1 ) return Math.asin(x);

  return arcsin( complex(x) );

}

function arccos( x ) {

  if ( isComplex(x) ) {

    return sub( pi/2, arcsin(x) );

  }

  if ( Math.abs(x) <= 1 ) return Math.acos(x);

  return arccos( complex(x) );

}

function arctan( x ) {

  if ( isComplex(x) ) {

    var s = sub( log( sub( 1, mul( complex(0,1), x ) ) ),
                 log( add( 1, mul( complex(0,1), x ) ) ) );
    return mul( complex(0,.5), s );

  }

  return Math.atan(x);

}

function arccot( x ) {

  if ( isComplex(x) ) return arctan( div( 1, x ) );

  return Math.atan( 1/x );

}

function arcsec( x ) {

  if ( isComplex(x) ) return arccos( div( 1, x ) );

  if ( Math.abs(x) >= 1 ) return Math.acos( 1/x );

  return arcsec( complex(x) );

}

function arccsc( x ) {

  if ( isComplex(x) ) return arcsin( div( 1, x ) );

  if ( Math.abs(x) >= 1 ) return Math.asin( 1/x );

  return arccsc( complex(x) );

}


// complex hyperbolic functions

function sinh( x ) {

  if ( isArbitrary(x) ) return div( sub( exp(x), exp(neg(x)) ), arb2 );

  if ( isComplex(x) )

    return { re: Math.sinh(x.re) * Math.cos(x.im),
             im: Math.cosh(x.re) * Math.sin(x.im) };

  return Math.sinh(x);

}

function cosh( x ) {

  if ( isArbitrary(x) ) return div( add( exp(x), exp(neg(x)) ), arb2 );

  if ( isComplex(x) )

    return { re: Math.cosh(x.re) * Math.cos(x.im),
             im: Math.sinh(x.re) * Math.sin(x.im) };

  return Math.cosh(x);

}

function tanh( x ) {

  if ( isComplex(x) ) return div( sinh(x), cosh(x) );

  return Math.tanh(x);

}

function coth( x ) {

  if ( isComplex(x) ) return div( cosh(x), sinh(x) );

  return 1 / Math.tanh(x);

}

function sech( x ) {

  if ( isComplex(x) ) return div( 1, cosh(x) );

  return 1 / Math.cosh(x);

}

function csch( x ) {

  if ( isComplex(x) ) return div( 1, sinh(x) );

  return 1 / Math.sinh(x);

}


// inverse hyperbolic functions

function arcsinh( x ) {

  if ( isComplex(x) ) {

    var s = sqrt( add( mul( x, x ), 1 ) );
    s = add( x, s );
    return log( s );

  }

  return Math.asinh(x);

}

function arccosh( x ) {

  if ( isComplex(x) ) {

    var s = mul( sqrt( add( x, 1 ) ), sqrt( sub( x, 1 ) ) );
    s = add( x, s ); 
    return log( s );

  }

  if ( x >= 1 ) return Math.acosh(x);

  return arccosh( complex(x) );

}

function arctanh( x ) {

  if ( isComplex(x) ) {

    var s = sub( log( add( 1, x ) ), log( sub( 1, x ) ) );
    return mul( .5, s );

  }

  if ( Math.abs(x) <= 1 ) return Math.atanh(x);

  return arctanh( complex(x) );

}

function arccoth( x ) {

  if ( isComplex(x) ) {

    if ( x.re === 0 && x.im === 0 ) throw Error( 'Indeterminate arccoth value' );

    return arctanh( div( 1, x ) );

  }

  if ( Math.abs(x) > 1 ) return Math.atanh( 1/x );

  return arccoth( complex(x) );

}

function arcsech( x ) {

  if ( isComplex(x) ) {

    if ( x.re === 0 && x.im === 0 ) throw Error( 'Indeterminate arcsech value' );

    // adjust for branch cut along negative axis
    if ( x.im === 0 ) x.im = -Number.MIN_VALUE;

    return arccosh( div( 1, x ) );

  }

  if ( x > 0 && x < 1 ) return Math.acosh( 1/x );

  return arcsech( complex(x) );

}

function arccsch( x ) {

  if ( isComplex(x) ) {

    return arcsinh( div( 1, x ) );

  }

  return Math.asinh( 1/x );

}


// miscellaneous

function sinc( x ) {

  if ( isComplex(x) ) {

    if ( x.re === 0 && x.im === 0 ) return complex(1);

    return div( sin(x), x );

  }

  if ( x === 0 ) return 1;

  return Math.sin(x) / x;

}

function ode( f, y, [x0,x1], step=.001, method='runge-kutta' ) {

  if ( x1 < x0 ) {
    function compare( x ) { return x >= x1; };
    step *= -1;
  } else
    function compare( x ) { return x <= x1; };

  // vectorizing first-order real equation works because +[1] = 1
  // for complex case +[C(1)] = NaN, so explicit array references
  //    are necessary in the input function

  if ( !Array.isArray(y) ) {
    var g = f;
    f = function(x,y) { return [ g(x,y) ]; };
    y = [ y ];
  }

  // preparation for complex system
  if ( isComplex(x0) || isComplex(x1) || y.some( e => isComplex(e) )
         || f(x0,y).some( e => isComplex(e) ) ) {

    if ( !isComplex(x0) ) x0 = complex(x0);

    y.forEach( (e,i,a) => { if ( !isComplex(e) ) a[i] = complex(e); } );

    if ( f(x0,y).every( e => !isComplex(e) ) )
      throw Error( 'All functions must handle complex math' );

    var d = sub(x1,x0), absD = abs(d);
    step = mul( step, div( d, absD ) );
    var steps = Math.trunc( absD / abs(step) ), currentStep = 0;

  }

  var points = [ [x0].concat(y) ];
  var size = y.length;

  switch( method ) {

    case 'euler':

      if ( isComplex(x0) ) {

        for ( var x = add(x0,step) ; currentStep < steps ; x = add(x,step) ) {

          var k = f(x,y);

          for ( var i = 0 ; i < size ; i++ ) y[i] = add( y[i], mul( k[i], step ) );

          points.push( [x].concat(y) );

          currentStep++;

        }

        return points;

      } else {

        for ( var x = x0+step ; compare(x) ; x += step ) {

          var k = f(x,y);

          for ( var i = 0 ; i < size ; i++ ) y[i] += k[i] * step;

          points.push( [x].concat(y) );

        }

        return points;

      }

    case 'runge-kutta':

      if ( isComplex(x0) ) {

        var halfStep = div( step, 2 );

        for ( var x = add(x0,step) ; currentStep < steps ; x = add(x,step) ) {

          var y1 = [], y2 = [], y3 = [];

          var k1 = f(x,y);
          for ( var i = 0 ; i < size ; i++ ) y1.push( add( y[i], mul( k1[i], halfStep ) ) );
          var k2 = f( add( x, halfStep ), y1 );
          for ( var i = 0 ; i < size ; i++ ) y2.push( add( y[i], mul( k2[i], halfStep ) ) );
          var k3 = f( add( x, halfStep ), y2 );
          for ( var i = 0 ; i < size ; i++ ) y3.push( add( y[i], mul( k3[i], step ) ) );
          var k4 = f( add( x, step ), y3 );

          for ( var i = 0 ; i < size ; i++ )
            y[i] = add( y[i], mul( add( k1[i], mul(2,k2[i]), mul(2,k3[i]), k4[i] ), step, 1/6 ) );

          points.push( [x].concat(y) );

          currentStep++;

        }

        return points;

      } else {

        for ( var x = x0+step ; compare(x) ; x += step ) {

          var y1 = [], y2 = [], y3 = [];

          var k1 = f(x,y);
          for ( var i = 0 ; i < size ; i++ ) y1.push( y[i] + k1[i]*step/2 );
          var k2 = f( x+step/2, y1 );
          for ( var i = 0 ; i < size ; i++ ) y2.push( y[i] + k2[i]*step/2 );
          var k3 = f( x+step/2, y2 );
          for ( var i = 0 ; i < size ; i++ ) y3.push( y[i] + k3[i]*step );
          var k4 = f( x+step, y3 );

          for ( var i = 0 ; i < size ; i++ )
            y[i] += ( k1[i] + 2*k2[i] + 2*k3[i] + k4[i] ) * step / 6;

          points.push( [x].concat(y) );

        }

        return points;

      }

    default:

      throw Error( 'Unsupported differential equation solver method' );

  }

}

function gcd(a, b) {
  if (!b) {
    return a;
  }

  return gcd(b, a % b);
}