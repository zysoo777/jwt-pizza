# Penetration Testing Report

Names: CheonSeok Oh & Jonathan Thornton

## Self attack

### Peer 1 (CheonSeok Oh)

| Item           | Result                                                                       |
| -------------- | ---------------------------------------------------------------------------- |
| Date           | April 9, 2025                                                                |
| Target         | https://pizza-service.cs329-jwt-pizza.click                                  |
| Classification | Identification and Authentication Failures                                   |
| Severity       | 1                                                                            |
| Description    | Performed a brute force attack on /api/auth using Burp Intruder. No unauthorized access was obtained.                                               |
| Images         | ![Brute Force Attack Self](CO_self_intruder1.png) <br/> Intruder results showing different responses for each password attempt |
| Corrections    | Implement rate limiting, account lockout, and stronger password policies to prevent brute force attacks.                                               |

### Peer 2 (Jonathan Thornton)

| Item           | Result                                                                       |
| -------------- | ---------------------------------------------------------------------------- |
| Date           | April 9, 2025                                                                |
| Target         | pizza.freevirus.click                                                        |
| Classification | Security Misconfiguration                                                    |
| Severity       | 3                                                                            |
| Description    | Admin credentials compromised.                                               |
| Images         | ![Security Misconfiguration](JT_self_intruder.png) <br/> Successful admin login |
| Corrections    | Remove default admin password                                                |


## Peer attack

### Peer 1 attack on peer 2:

| Item           | Result                                                                       |
| -------------- | ---------------------------------------------------------------------------- |
| Date           | April 9, 2025                                                                |
| Target         | https://pizza-service.freevirus.click                                  |
| Classification | Identification and Authentication Failures                                   |
| Severity       | 1                                                                            |
| Description    | Performed a brute force attack on /api/auth using Burp Intruder. No unauthorized access was obtained.                                               |
| Images         | ![Peer Attack 1](CO_JT_peer_attack1.png) <br/> Intruder results showing different responses for each password attempt |
| Corrections    | Implement rate limiting, account lockout, and stronger password policies to prevent brute force attacks. 

### Peer 2 attack on peer 1: Create an attack record for each attack.

