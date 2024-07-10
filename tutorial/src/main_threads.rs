use std::{
    env,
    io::{self, Write},
    net::{IpAddr, TcpStream},
    process,
    sync::mpsc::{channel, Sender}, thread,
};

use arguments::Arguments;

mod arguments;

static LANGUAGE: &str = "Rust";
const MAX: u16 = 65535;

const THRESHOLD: i32 = 10;

fn is_big(n: i32) -> bool {
    n > THRESHOLD
}

fn scan(tx: Sender<u16>, start_port: u16, addr: IpAddr, num_threads: u16) {
    let mut port: u16 = start_port + 1;
    loop {
        match TcpStream::connect((addr, port)) {
            Ok(_) => {
                print!(".");
                io::stdout().flush().unwrap();
                tx.send(port).unwrap();
            }
            Err(_) => {}
        }

        if (MAX - port) <= num_threads {
            break;
        }

        port += num_threads;
    }
}

fn main_threads() {
    let args: Vec<String> = env::args().collect();

    let program = args[0].clone();

    let arguments = Arguments::new(&args).unwrap_or_else(|err| {
        if err.contains("help") {
            process::exit(0);
        } else {
            eprintln!("{} problem parsing arguments {}", program, err);
            process::exit(0);
        }
    });

    let num_threads = arguments.threads;
    let addr = arguments.ip_addr;
    let (tx, rx) = channel();
    

    for i in 0..num_threads {
        let tx = tx.clone();

        thread::spawn(move || {
            scan(tx, i, addr, num_threads);
        });
    }


    drop(tx);

    let mut out = vec![];

    println!("");

    for p in rx {
        out.push(p);
    }


    out.sort();
    println!("called");

    for v in out {
        println!("{} is open", v);
    }

}
