## Matrices as Transformations

> section: transformations
> sectionStatus: dev
> id: test

{.todo} COMING SOON

::: column.grow

We rotate point [P](target:p) by ${th + '°'}{th|60|10,350,10} around the origin.

::: column(width=400)

    x-geopad(width=400 x-axis="-5,5,1" y-axis="-5,5,1" axes grid padding=5): svg
      circle.move.green(name="p" x="point(2,3)" label="P" target="p")
      circle.green(name="q" x="p.rotate(th/180*pi)" label="P'")
      
      path.green(x="segment(point(0,0),p)")
      path.green(x="segment(point(0,0),q)")

:::

We want to draw a spaceship.
We can represent our spaceship as a collection of points.


When we rotate each point A, B, C, etc, we will give the new point the name A’ (A prime), B’, C’

Here is a spaceship we can rotate by ${phi + 'º'}{phi|60|10,350,10} around the origin.

::: column(width=400)

    x-geopad(width=400 x-axis="-5,5,1" y-axis="-5,5,1" axes grid padding=5): svg
      circle.green(name="a" x="point(0,3)" label="A" target="a")
      circle.green(name="b" x="point(3,0)" label="B")
      circle.green(name="c" x="point(3,-3)" label="C")
      circle.green(name="d" x="point(0,-1)" label="D")
      circle.green(name="e" x="point(-3,-3)" label="E")
      circle.green(name="f" x="point(-3,0)" label="F")

      circle.blue(name="ap" x="a.rotate(phi/180*pi)" label="A'")
      circle.blue(name="bp" x="b.rotate(phi/180*pi)" label="B'")
      circle.blue(name="cp" x="c.rotate(phi/180*pi)" label="C'")
      circle.blue(name="dp" x="d.rotate(phi/180*pi)" label="D'")
      circle.blue(name="ep" x="e.rotate(phi/180*pi)" label="E'")
      circle.blue(name="fp" x="f.rotate(phi/180*pi)" label="F'")

      path.green(x="segment(a,b)")
      path.green(x="segment(b,c)")
      path.green(x="segment(c,d)")
      path.green(x="segment(d,e)")
      path.green(x="segment(e,f)")
      path.green(x="segment(f,a)")

      path.blue(x="segment(ap,bp)")
      path.blue(x="segment(bp,cp)")
      path.blue(x="segment(cp,dp)")
      path.blue(x="segment(dp,ep)")
      path.blue(x="segment(ep,fp)")
      path.blue(x="segment(fp,ap)")

:::

---

> id: unit-j

REVISE: put unit-i and unit-j side by side, so there's not so much emphasis on them.

Now let's look at one point at a time how this might work.
Let's rotate this point [A](target:a) at (0,3) ${t1 + 'º'}{t1|60|10,350,10} around the origin. Our rotated point is called [A'](target:ap).

::: column(width=400)

    x-geopad(width=400 x-axis="-5,5,1" y-axis="-5,5,1" axes grid padding=5): svg
      circle.green(name="a" x="point(0,3)" label="A" target="a")

      circle.blue(name="ap" x="a.rotate(t1/180*pi)" label="A'" target="ap")

      path.green(x="segment(point(0,0),a)")

      path.blue(x="segment(point(0,0),ap)")
      path.red(x="segment(point(0,ap.y), point(ap.x, ap.y))" target="xp" label="x'")
      path.yellow(x="segment(point(0,0), point(0, ap.y))" target="yp" label="y'")


:::

What is a formula to get the new coordinates for A’? We can call our new x value [x'](target:xp), and our new y value [y'](target:yp). Both x' and y' will be dependent on the length of __A__, which is 3.


x' = 3 * [[-sinθ|sinθ|cosθ]]

y' = 3 * [[cosθ|sinθ]]



---

> id: unit-i

Let's look at another point.
Rotate the point [B](target:b) (3,0) ${t1 + 'º'}{t1|60|10,90,10} around the origin.

::: column(width=400)

    x-geopad(width=400 x-axis="-5,5,1" y-axis="-5,5,1" axes grid padding=5): svg
      circle.green(name="a" x="point(3,0)" label="B" target="b")

      circle.blue(name="ap" x="a.rotate(t1/180*pi)" label="B'" target="bp")

      path.green(x="segment(point(0,0),a)")

      path.blue(x="segment(point(0,0),ap)")
      path.red(x="segment(point(0,0), point(ap.x, 0))" label="x'" target="xp")
      path.yellow(x="segment(point(ap.x, 0), point(ap.x, ap.y))" label="y'" target="yp")


:::

What is a formula to get the new coordinates for [B’](target:bp)? We can call our new x value [x'](target:xp), and our new y value [y'](target:yp). Both x' and y' will be dependent on the length of __B__, which is 3.


x' = 3 * [[cosθ|sinθ]]

y' = 3 * [[sinθ|cosθ]]

---

Now that we have computed the formula for two points, can we say anthing about the general formula for rotation?

Remember from our last course that any vector can be treated as a sum of the two unit vectors <uv>__i__</uv> and <uv>__j__</uv>.

Our points __A__ and __B__ were the unit vectors <uv>__j__</uv> and <uv>__i__</uv>, each multiplied by 3.

Instead of using trigonometry to find rotated point of (1, -1) or (0, -0.5), we can re-write these as... i - j.
It turns out that we can apply blah blah blah... linear transformation.

for x...

x' = xi + xj
x' = x * cosTH - y * sinTH

for y...

y' = yi + yj
y' = x * sinTH + y * cosTH

put it together and...

x'       x * cosTH - y * sinTH
     = 
y'       x * sinTH + y * cosTH

Notice that there are like terms in here: both are dependent on X and Y.

Mathematicians came up with a concept called the "matrix", to do this easier, and you'll see this is a very powerful construct.

A matrix is like a spreadsheet.

This is a 2x2 matrix, but they can be any size.

***Here's some formatting for how a matrix times a vector works.***

> id: play-with-me

Linear transformation means each grid line will remain "parallel and evenly spaced". Now play with it.

    // try w/ grid on or off, to compare underlying grid w/ transformation
    - var GRID = 5
    x-geopad(width=400 x-axis=`-${GRID},${GRID},1` y-axis=`-${GRID},${GRID},1` grid padding=5): svg
      circle.green.move(name="ipoint" x="point(1,0)" target="i")
      circle.blue.move(name="jpoint" x="point(0,1)" target="j")
      circle(name="origin", x="point(0,0)")


        // right values for these? Ideally we'd show to "infinity", but this might render slowly?
      - var MINMAX = GRID*2
      - for (var b=-MINMAX; b <=MINMAX; ++b)
        // .fabric as in "fabric of reality"
        // can also try class ".grid" for default grid
        path.fabric(x=`line(point(${b}*jpoint.x, ${b}*jpoint.y), point(ipoint.x + ${b}*jpoint.x, ipoint.y + ${b}*jpoint.y))`)
        path.fabric(x=`line(point(${b}*ipoint.x, ${b}*ipoint.y), point(${b}*ipoint.x + jpoint.x, ${b}*ipoint.y + jpoint.y))`)

      - var SPACESHIP = [[3,0], [0,3], [-3,0], [-3,-3], [0,-1], [3,-3]]
      each p,i in SPACESHIP
        circle.red(name=`s${i}` x=`point(${p[0]}*ipoint.x+${p[1]}*jpoint.x,${p[0]}*ipoint.y+${p[1]}*jpoint.y)`)
        path.red(x=`segment(s${i}, s${(i+1)%SPACESHIP.length})`)

      path.green(x="segment(point(0,0),ipoint)", label="i", target="i")
      path.blue(x="segment(point(0,0),jpoint)", label="j", target="j")



Here we display the [i](target:i) and [j](target:j) unit vectors.
Inside the matrix we have i = (${ipoint.x}, ${ipoint.y}) and j = (${jpoint.x}, ${jpoint.y})

    .button IDENTITY
    .button SKEW
    .button SCALE
    .button ROTATE

Press the buttons to...

---

## Matrix Arithmetic

### Matrix Addition
> section: arithmetic
> sectionStatus: dev

This is easy.
* Two matrices can be added only if they have the same dimensions.
* The resulting matrix will be the same dimension as the matrices added.
* Each value in location (x,y) of the resulting matrix will be the sum of the values at (x,y) in the other two matrices.

{.todo} COMING SOON

### Matrix Multiplication

* Two matrices A, B of dimensions dim(A)=|ra,ca|, dim(B)=|rb,cb| can only be multiplied if ca is equal to rb.

Does this make sense?
What will be the dimensions of the resulting matrix?

> section: multiply
> id: multiply

    mixin ij(i, j, label)
      .cube
        - var iSeg = "segment(point(0,0),point(" +i[0] + "," + i[1] + "))"
        - var jSeg = "segment(point(0,0),point(" +j[0] + "," + j[1] + "))"
        x-geopad(width=100 x-axis="-2,2,1" y-axis="-2,2,1" grid padding=5): svg
          path.red(x=iSeg label="i")
          path.green(x=jSeg label="j")
        .caption= label

#### Matrix Multiplication as Successive Transformations.

    .cubes
      +ij([1,0], [0,1], "Identity")
      +ij([0,1], [-1,0], "Rotate 90º")
      +ij([-1,0], [0,-1], "Rotate 180º")
      +ij([0,-1], [1,0], "Rotate 270º")
      
      +ij([-1,0], [0,1], "Reflect x=0")
      +ij([0,1], [1,0], "Reflect y=x")
      +ij([1,0], [0,-1], "Reflect y=0")
      +ij([0,-1], [-1,0], "Reflect y=-x")

      +ij([1,1], [0,1], "Skew x 1")
      +ij([1,-1], [0,1], "Skew x -1")
      +ij([1,0], [1,1], "Skew y 1")
      +ij([1,0], [-1,1], "Skew y -1")

When we multiply two of these matrices, we are applying the same transformations twice. Let's see what happens.


> section: calculator
> id: calculator

Now we can actually start doing some arithmetic with these transformations. For example, we can _multiply_ two transformations to get new ones:

::: column(width=260)

    .text-center
      +ij([0,1], [-1,0], "Rotate 90º")
      mo x
      +ij([-1,0], [0,-1], "Rotate 180º")
      mo =
      span.sym-sum.pending(tabindex=0): +ij([0,-1], [1,0], "Rotate 270º")
    x-gesture(target=".sym-sum")

::: column(width=260)

    .text-center
      +ij([-1,0], [0,1], "Reflect x=0")
      mo x
      +ij([-1,0], [0,1], "Reflect x=0")
      mo =
      span.sym-sum.pending(tabindex=0): +ij([1,0], [0,1], "Identity")

:::


---
> id: tools
> goals: play-l1 play-c1

    figure: img(src="images/divider-1.svg" width=760 height=42)

Euclid’ axioms basically tell us _what’s possible_ in his version of geometry.
It turns out that we just need two very simple tools to be able to sketch this
on paper:

::: column(width=320)

    x-geopad.r(width=300 height=240)
      svg
        circle.move(name="a" cx=50 cy=190)
        circle.move(name="b" cx=250 cy=50)
        path.red(name="l1" x="segment(a,b)" hidden)
      x-play-btn

{.text-center} A __straight-edge__ is like a ruler but without any markings. You
can use it to connect two points (as in Axiom 1), or to extend a line segment
(as in Axiom 2).

::: column.reveal(width=300 when="play-l1")

    x-geopad.r(width=300 height=240)
      svg
        circle.move(name="c" cx=150 cy=120)
        circle.move(name="d" cx=250 cy=150)
        path(x="segment(c,d)")
        path.red(name="c1" x="arc(c,d,1.99*pi)" hidden)
      x-play-btn

{.text-center} A __compass__ allows you to draw a circle of a given size around
a point (as in Axiom 3).
:::


---

## Determinants

> section: determinants
> sectionStatus: dev

{.todo} COMING SOON

---

## Matrix Inverses

> section: inverses
> sectionStatus: dev

{.todo} COMING SOON

---

## Cramer’s Rule and Gaussian Elimination

> section: systems
> sectionStatus: dev

{.todo} COMING SOON

---

## Eigenvalues and Eigenvectors

> section: eigenvalues
> sectionStatus: dev

{.todo} COMING SOON

---

## Translations

> id: translations
> section: translations

Now it's your turn - translate this:

    svg(width=220 height=220)
      each i in [10,30,50,70,90,110,130,150,170,190,210]
        line(x1=i x2=i y1=0 y2=220 stroke="#e6e6e6" stroke-width=2)
      each i in [10,30,50,70,90,110,130,150,170,190,210]
        line(x1=0 x2=220 y1=i y2=i stroke="#e6e6e6" stroke-width=2)
      polygon(points="30,10 10,70 70,70 50,10" style="fill:#289782; opacity: .5;")
      polygon(points="30,10 10,70 70,70 50,10" style="fill: #289782; cursor: move")

{.caption} Adjust this matrix to perform a transformation.

And mimic the layout of Nicky Case's matrix.

Oh and this thing ${a} is a slider for ${a}{a|0|-2.0,2.0,0.1}

---

> id: rotations

Now let's rotate this:

    svg(width=220 height=220)
      each i in [10,30,50,70,90,110,130,150,170,190,210]
        line(x1=i x2=i y1=0 y2=140 stroke="#e6e6e6" stroke-width=2)
      each i in [10,30,50,70,90,110,130,150,170,190,210]
        line(x1=0 x2=220 y1=i y2=i stroke="#e6e6e6" stroke-width=2)
      polygon(points="50,10 90,50 50,90 10,50" style="fill: #2ba058; opacity: .5;")
      polygon(points="50,10 90,50 50,90 10,50" style="fill: #2ba058; cursor: move")

{.caption} Adjust this matrix to make it rotate.

Adjust the angle ${angle} with this slider for ${angle}{angle|0|-359,360,5}

---

## Matrix Rotate
> section: matrix-rotate
> id: rotate

#### Rotate
Let's see how rotation works.

    svg(width=220 height=220)
      g.grid
        each i in [10,30,50,70,90,110,130,150,170,190,210]
          - var width = i == 110 ? 4 : 2
          - stroke = i == 110 ? "#e6e6e6" : "#e6e6e6"
          line(x1=i x2=i y1=0 y2=210 stroke=stroke stroke-width=width)
        each i in [10,30,50,70,90,110,130,150,170,190,210]
          - var width = i == 110 ? 4 : 2
          - stroke = i == 110 ? "#e6e6e6" : "#e6e6e6"
          line(x1=0 x2=220 y1=i y2=i stroke=stroke stroke-width=width)
      g.var.rotate(:html="polygonRotate(angle)")

Rotate: adjust this ${angle}{angle|0|-340,340,20} degrees

<table>
<tr><td>cos(${angle})</td><td>-sin(${angle})</td></tr>
<tr><td>sin(${angle})</td><td>cos(${angle})</td></tr>
</table>

Now add the final result?

---

## Matrix Scale
> section: matrix-scale
> id: scale

#### Scale
Let's try a scale operation.

    svg(width=220 height=220)
      g.grid
        each i in [10,30,50,70,90,110,130,150,170,190,210]
          - var width = i == 110 ? 4 : 2
          - stroke = i == 110 ? "#e6e6e6" : "#e6e6e6"
          line(x1=i x2=i y1=0 y2=210 stroke=stroke stroke-width=width)
        each i in [10,30,50,70,90,110,130,150,170,190,210]
          - var width = i == 110 ? 4 : 2
          - stroke = i == 110 ? "#e6e6e6" : "#e6e6e6"
          line(x1=0 x2=220 y1=i y2=i stroke=stroke stroke-width=width)
      g.var.scale(:html="polygonScale(xscale, yscale)")


Adjust the matrix to see how it changes in the coordinates.

<table>
<tr><td>${xscale}{xscale|1.0|-2.0,2.0,0.1}</td><td>0</td></tr>
<tr><td>0</td><td>${yscale}{yscale|1.0|-2.0,2.0,0.1}</td></tr>
</table>

Cool. Let's now add some code that lets us snap to x-big, x-shrink, x-reverse, y-big, y-shrink, y-reverse.

---

## Skew
> id: skew

#### Skew 
Now let's try a skew


    svg(width=220 height=220)
      g.grid
        each i in [10,30,50,70,90,110,130,150,170,190,210]
          - var width = i == 110 ? 4 : 2
          - stroke = i == 110 ? "#e6e6e6" : "#e6e6e6"
          line(x1=i x2=i y1=0 y2=210 stroke=stroke stroke-width=width)
        each i in [10,30,50,70,90,110,130,150,170,190,210]
          - var width = i == 110 ? 4 : 2
          - stroke = i == 110 ? "#e6e6e6" : "#e6e6e6"
          line(x1=0 x2=220 y1=i y2=i stroke=stroke stroke-width=width)
      g.var.skew(:html="polygonSkew(xskew, yskew)")


Adjust the matrix to see how it changes in the coordinates.

<table>
<tr><td>1</td><td>${xskew}{xskew|0.0|-2.0,2.0,0.1}</td></tr>
<tr><td>${yskew}{yskew|0.0|-2.0,2.0,0.1}</td><td>1</td></tr>
</table>

Now add some buttons and code that make it snap to a set of matrix values.