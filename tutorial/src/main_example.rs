fn main_example() {
    let x = 4;
    println!("x is: {}", x);


    {
        let x = 3;
        println!("x is: {}", x);
    }

    let x = x + 1;
    println!("x is: {}", x);


    let x = "hello";
    println!("x is: {}", x);

    let mut y = 0;
    println!("y is: {}", y);

    y = 1;
    println!("y is: {}", y);



    const SECONDS_IN_MINUTE: u32 = 60;
    println!("{} minutes", SECONDS_IN_MINUTE);
}
