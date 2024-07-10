

#[derive(Debug)]
struct Person {
    name: String,
    age: u8,
}

struct Unit;

struct Point {
    x: f32,
    y: f32,
}

struct Rectangle {
    top_left: Point,
    bottom_right: Point,
}
struct Pair(i32, f32);


pub fn structs() {
    let name = String::from("Petter");
    let age = 27;
    let peter = Person { name, age };

    println!("{:?}", peter);

    let point: Point = Point { x: 10.3, y: 0.4 };
    let another_point: Point = Point { x: 1.3, y: 1.4 };

    println!("point coordinates: ({}, {})", point.x, point.y);

    let bottom_right = Point {
        x: 5.2,
        ..another_point
    };

    println!("second point: ({}, {})", bottom_right.x, bottom_right.y);

    let Point {
        x: left_edge,
        y: top_edge,
    } = point;

    let _rectangle = Rectangle {
        top_left: Point {
            x: left_edge,
            y: top_edge,
        },
        bottom_right: bottom_right,
    };

    let _unit = Unit;

    let pair: Pair = Pair(1, 0.1);
    println!("pair contains {:?} and {:?}", pair.0, pair.1);
    let Pair(integer, decimal) = pair;

    println!("pair contains {:?} and {:?}", integer, decimal);
}