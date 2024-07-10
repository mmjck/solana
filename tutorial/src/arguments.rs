use std::{net::IpAddr, str::FromStr};


pub struct  Arguments {
    flag: String,
    pub ip_addr: IpAddr,
    pub threads: u16
}


impl  Arguments {
    pub fn new(args : &[String]) -> Result<Arguments, &'static str> {
        if( args.len() < 2){
            return Err("not enough arguments");
        }else if args.len() > 4 {
            return Err("too many arguments");
        }


        let f = args[1].clone();
        if let Ok(ip_addr) = IpAddr::from_str(&f){
            return Ok(Arguments { 
                flag: String::from(""),
                ip_addr, 
                threads: 4
            })
        }else {
            let flag = args[1].clone();

            if flag.contains("-h") || flag.contains("-help") && args.len() == 2 {
                println!("Usage: -j to select how many threads you want \n -h or -help to show this help message");
                return Err("help");
            }else if flag.contains("-h") || flag.contains("-help")  {
                return Err("too many arguments");
            }else if flag.contains("-j") {
                let ip_addr = match  IpAddr::from_str(&args[3]) {
                    Ok(s) => s,
                    Err(_) => return Err("not a valid IPADDR; must ne IPv4 or IPv6")
                };

                let threads = match  args[2].parse::<u16>() {
                    Ok(s) => s,
                    Err(_) => return Err("not a valid IPADDR; must ne IPv4 or IPv6")
                };
                return Ok(Arguments{threads, flag, ip_addr});
            }else {
                return Err("invalid syntax");

            }
        }
    }
}