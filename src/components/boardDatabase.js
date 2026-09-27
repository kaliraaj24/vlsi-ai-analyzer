export const KNOWN_BOARDS = {
  "basys3": {
    id: "basys3",
    name: "Basys 3 FPGA Trainer Board",
    manufacturer: "Digilent / AMD Xilinx",
    fpgaFamily: "Artix-7",
    deviceNumber: "XC7A35T-1CPG236C",
    description: "Entry-level FPGA development board designed for introductory digital logic circuit design.",
    vccInt: "1.0V",
    vccO: "3.3V",
    goldComponents: [
      { id: "fpga_main", name: "Xilinx Artix-7 XC7A35T FPGA", type: "FPGA / SoC", confidence: 0.993, manufacturer: "AMD Xilinx", partNumber: "XC7A35T-CPG236", pins: "236 BGA", voltage: "1.0V (VCCINT), 3.3V (VCCO)", function: "Primary Logic Computing Core", description: "33,280 Logic Cells, 1,800 Kb Block RAM, 90 DSP Slices.", applications: "Digital Circuit Design, Hardware Emulation", datasheet: "https://www.xilinx.com/support/documentation/data_sheets/ds181_Artix_7_Data_Sheet.pdf", bbox: { x: 38, y: 35, w: 24, h: 26 } },
      { id: "flash_spi", name: "Spansion S25FL032P SPI Flash Memory", type: "Flash Memory", confidence: 0.981, manufacturer: "Infineon / Spansion", partNumber: "S25FL032P", pins: "8-SOIC", voltage: "3.3V", function: "Non-volatile FPGA Bitstream Configuration Storage", description: "32 Mbit Quad-SPI NOR Flash Memory chip.", applications: "FPGA Bootloader Storage", datasheet: "https://www.infineon.com/dgdl/Infineon-S25FL032P-DataSheet-v07_00-EN.pdf", bbox: { x: 22, y: 25, w: 12, h: 14 } },
      { id: "usb_ftdi", name: "FTDI FT2232HQ USB-JTAG Converter", type: "Interconnect", confidence: 0.975, manufacturer: "FTDI Chip", partNumber: "FT2232HQ", pins: "64-QFN", voltage: "3.3V", function: "USB JTAG Programming & UART Bridge", description: "Dual High Speed USB to Multipurpose UART/FIFO IC.", applications: "FPGA Programming, Serial Communication", datasheet: "https://ftdichip.com/wp-content/uploads/2020/08/DS_FT2232H.pdf", bbox: { x: 12, y: 12, w: 14, h: 16 } },
      { id: "clock_osc", name: "100 MHz Master Crystal Oscillator", type: "Crystal Oscillator", confidence: 0.962, manufacturer: "Abracon", partNumber: "ASE-100.000MHZ-LC", pins: "4-SMD", voltage: "3.3V", function: "Primary System Master Clock Input", description: "High stability 100.000 MHz CMOS Surface Mount Crystal Oscillator.", applications: "System Clock Generation", datasheet: "https://abracon.com/Oscillators/ASE.pdf", bbox: { x: 26, y: 44, w: 10, h: 10 } },
      { id: "pmic_reg", name: "Linear Technology LTC3633 Voltage Regulator", type: "Voltage Regulator", confidence: 0.954, manufacturer: "Analog Devices / LTC", partNumber: "LTC3633EUFD", pins: "28-QFN", voltage: "1.0V, 1.8V, 3.3V", function: "Multi-rail System Power Management", description: "Dual 3A High Efficiency Step-Down DC/DC Regulator.", applications: "Power Distribution", datasheet: "https://www.analog.com/media/en/technical-documentation/data-sheets/3633fd.pdf", bbox: { x: 68, y: 15, w: 14, h: 16 } },
      { id: "vga_dac", name: "4-Bit Resistor Ladder VGA DAC", type: "Interconnect", confidence: 0.941, manufacturer: "Digilent", partNumber: "VGA-DAC-R12", pins: "12 Passive Resistors", voltage: "3.3V", function: "Analog Video Output Generation (12-bit Color)", description: "Resistor network converting 4-bit R, G, B digital signals to analog VGA.", applications: "Video Display Driver", datasheet: "https://digilent.com/reference/programmable-logic/basys-3/reference-manual", bbox: { x: 74, y: 38, w: 16, h: 22 } },
      { id: "pmod_ja", name: "PMOD Header JA (Standard I/O)", type: "PMOD Header", confidence: 0.968, manufacturer: "Amphenol FCI", partNumber: "68000-106HLF", pins: "12-Pin Through-Hole", voltage: "3.3V", function: "Peripheral Expansion Connector", description: "Standard 2x6 right-angle female pin header for external sensors.", applications: "PMOD Sensor Interfacing", datasheet: "https://digilent.com/reference/pmod/start", bbox: { x: 10, y: 68, w: 18, h: 24 } },
      { id: "dip_switches", name: "16-Position User DIP Switch Bank", type: "DIP Switch", confidence: 0.987, manufacturer: "CTS", partNumber: "208-16", pins: "32 DIP Pins", voltage: "3.3V", function: "Digital User Input Control", description: "Slide switch array connected to FPGA GPIO pins SW0 through SW15.", applications: "User Test Input", datasheet: "https://www.ctscorp.com/wp-content/uploads/208.pdf", bbox: { x: 30, y: 76, w: 40, h: 14 } },
      { id: "user_leds", name: "16 Green User Output LEDs", type: "LED", confidence: 0.985, manufacturer: "Lite-On", partNumber: "LTST-C190KGKT", pins: "16 SMD Pairs", voltage: "3.3V", function: "Visual Logic Output Display", description: "Array of 16 green SMD surface-mount LEDs LD0 through LD15.", applications: "Status Indicators", datasheet: "https://optoelectronics.liteon.com/en-global/Led/LED-Component/Detail/190", bbox: { x: 30, y: 64, w: 40, h: 8 } }
    ]
  },
  "zedboard": {
    id: "zedboard",
    name: "ZedBoard Zynq-7000 Development Board",
    manufacturer: "Avnet / AMD Xilinx",
    fpgaFamily: "Zynq-7000 SoC",
    deviceNumber: "XC7Z020-1CLG484C",
    description: "Evaluation board based on Xilinx Zynq-7000 AP SoC combining Dual ARM Cortex-A9 cores with Artix-7 Programmable Logic.",
    vccInt: "1.0V",
    vccO: "1.8V / 3.3V",
    goldComponents: [
      { id: "zynq_soc", name: "Xilinx Zynq-7000 XC7Z020 AP SoC", type: "FPGA / SoC", confidence: 0.996, manufacturer: "AMD Xilinx", partNumber: "XC7Z020-1CLG484C", pins: "484 BGA", voltage: "1.0V (VCCINT), 1.8V (VCCPAUX)", function: "Heterogeneous Dual ARM Cortex-A9 + 85K Logic Cell FPGA", description: "Processing System (PS) fused with Programmable Logic (PL).", applications: "Embedded Linux, Real-time Control, Computer Vision", datasheet: "https://www.xilinx.com/support/documentation/data_sheets/ds190-Zynq-7000-Overview.pdf", bbox: { x: 36, y: 32, w: 28, h: 30 } },
      { id: "ddr3_ram", name: "Micron 512MB DDR3 SDRAM (2x 256MB)", type: "DDR Memory", confidence: 0.989, manufacturer: "Micron Technology", partNumber: "MT41K128M16JT-125", pins: "96-FBGA", voltage: "1.5V", function: "System RAM Memory for ARM Cortex-A9", description: "512 MByte 32-bit wide DDR3 SDRAM running at 533 MHz.", applications: "Linux OS Kernel Memory, Image Buffering", datasheet: "https://www.micron.com/-/media/client/global/documents/products/data-sheet/dram/ddr3/1gb_1_35v_ddr3l.pdf", bbox: { x: 66, y: 30, w: 22, h: 28 } },
      { id: "eth_phy", name: "Marvell 88E1512 Gigabit Ethernet PHY", type: "Power IC", confidence: 0.971, manufacturer: "Marvell", partNumber: "88E1512-A0-NNP2I000", pins: "56-QFN", voltage: "1.8V, 3.3V", function: "10/100/1000 Mbps Physical Layer Ethernet Transceiver", description: "IEEE 802.3 compliant RGMII Gigabit Ethernet transceiver.", applications: "Network Connectivity, Web Services", datasheet: "https://www.marvell.com/content/dam/marvell/en/public-collateral/transceivers/marvell-phys-transceivers-88e1512-datasheet.pdf", bbox: { x: 14, y: 16, w: 14, h: 16 } },
      { id: "hdmi_tx", name: "Analog Devices ADV7511 HDMI Transmitter", type: "Interconnect", confidence: 0.963, manufacturer: "Analog Devices", partNumber: "ADV7511KSTZ", pins: "100-LQFP", voltage: "1.8V, 3.3V", function: "1080p High-Definition Multimedia Transmitter", description: "225 MHz HDMI transmitter with Audio Return Channel.", applications: "High Definition Video Display Output", datasheet: "https://www.analog.com/media/en/technical-documentation/data-sheets/ADV7511.pdf", bbox: { x: 74, y: 64, w: 16, h: 18 } },
      { id: "usb_otg", name: "Microchip USB3320 USB 2.0 ULPI Transceiver", type: "Interconnect", confidence: 0.958, manufacturer: "Microchip / SMSC", partNumber: "USB3320C-EZK", pins: "32-QFN", voltage: "3.3V", function: "High Speed USB 2.0 Host/Device PHY", description: "UTMI+ Low Pin Interface (ULPI) USB 2.0 PHY transceiver.", applications: "USB OTG Connectivity", datasheet: "https://ww1.microchip.com/downloads/en/DeviceDoc/00001792B.pdf", bbox: { x: 14, y: 36, w: 12, h: 14 } }
    ]
  },
  "nexysa7": {
    id: "nexysa7",
    name: "Nexys A7-100T FPGA Trainer Board",
    manufacturer: "Digilent / AMD Xilinx",
    fpgaFamily: "Artix-7",
    deviceNumber: "XC7A100T-1CSG324C",
    description: "Feature-rich FPGA development board featuring 15,850 logic slices and 128MB DDR2 RAM.",
    vccInt: "1.0V",
    vccO: "1.8V / 3.3V",
    goldComponents: [
      { id: "fpga_a100t", name: "Xilinx Artix-7 XC7A100T FPGA", type: "FPGA / SoC", confidence: 0.995, manufacturer: "AMD Xilinx", partNumber: "XC7A100T-1CSG324C", pins: "324 BGA", voltage: "1.0V (VCCINT)", function: "Primary Logic & Signal Processing Core", description: "101,440 Logic Cells, 4,860 Kb Block RAM, 240 DSP Slices.", applications: "Industrial Automation, Complex Digital Signal Processing", datasheet: "https://www.xilinx.com/support/documentation/data_sheets/ds181_Artix_7_Data_Sheet.pdf", bbox: { x: 35, y: 34, w: 26, h: 28 } },
      { id: "ddr2_mem", name: "Micron 128MB DDR2 SDRAM", type: "DDR Memory", confidence: 0.982, manufacturer: "Micron", partNumber: "MT47H64M16HR-25E", pins: "84-FBGA", voltage: "1.8V", function: "High-Speed Frame Buffer & Working Memory", description: "1 Gbit DDR2 SDRAM memory component.", applications: "Video Frame Buffering, Data Processing", datasheet: "https://www.micron.com/products/dram/ddr2-sdram", bbox: { x: 64, y: 34, w: 18, h: 22 } },
      { id: "eth_phy_100", name: "SMSC LAN8720A 10/100 Ethernet PHY", type: "Power IC", confidence: 0.965, manufacturer: "Microchip / SMSC", partNumber: "LAN8720A-CP-TR", pins: "24-QFN", voltage: "3.3V", function: "Fast Ethernet Physical Layer Transceiver", description: "Small footprint RMII 10/100 Ethernet PHY transceiver.", applications: "Embedded Networking", datasheet: "https://ww1.microchip.com/downloads/en/DeviceDoc/8720a.pdf", bbox: { x: 12, y: 14, w: 12, h: 14 } }
    ]
  },
  "arduino_uno": {
    id: "arduino_uno",
    name: "Arduino Uno R3 Board (Roboflow Kaggle Dataset)",
    manufacturer: "Arduino",
    fpgaFamily: "AVR Microcontroller",
    deviceNumber: "ATmega328P-PU",
    description: "Standard open-source microcontroller board based on the 8-bit ATmega328P.",
    vccInt: "5.0V",
    vccO: "5.0V / 3.3V",
    goldComponents: [
      { id: "atmega328p", name: "Microchip ATmega328P 8-Bit MCU", type: "DIP Integrated Circuit (IC)", confidence: 0.997, manufacturer: "Microchip / Atmel", partNumber: "ATmega328P-PU", pins: "28 DIP", voltage: "5.0V", function: "Primary 16MHz Microcontroller Core", description: "32KB Flash Memory, 2KB SRAM, 1KB EEPROM.", applications: "Embedded Control, Prototyping", datasheet: "https://ww1.microchip.com/downloads/en/DeviceDoc/ATmega48A-PA-88A-PA-168A-PA-328-P-DS-DS40002061A.pdf", bbox: { x: 30, y: 40, w: 40, h: 18 } },
      { id: "atmega16u2", name: "ATmega16U2 USB-Serial Interface", type: "SMD Integrated Circuit (QFP/SOP/BGA)", confidence: 0.976, manufacturer: "Microchip", partNumber: "ATmega16U2-MU", pins: "32-QFN", voltage: "5.0V", function: "USB-to-Serial UART Converter", description: "High-speed USB microcontroller running USB serial firmware.", applications: "Serial Communication & Upload", datasheet: "https://ww1.microchip.com/downloads/en/DeviceDoc/doc7799.pdf", bbox: { x: 12, y: 16, w: 14, h: 16 } },
      { id: "crystal_16mhz", name: "16 MHz Crystal Oscillator", type: "Crystal Oscillator", confidence: 0.981, manufacturer: "CTS", partNumber: "HC49US-16.000MABJ-UT", pins: "2 HC-49/US", voltage: "5.0V", function: "System Master Clock Generation", description: "16.000 MHz parallel resonant crystal oscillator.", applications: "System Clock", datasheet: "https://www.ctscorp.com", bbox: { x: 24, y: 28, w: 8, h: 10 } },
      { id: "voltage_reg_5v", name: "AMS1117-5.0V LDO Voltage Regulator", type: "Voltage Regulator / PMIC", confidence: 0.985, manufacturer: "Advanced Monolithic Systems", partNumber: "AMS1117-5.0", pins: "SOT-223", voltage: "5.0V", function: "5.0V DC Linear Voltage Regulation", description: "1A low dropout linear regulator.", applications: "Power Rail Regulation", datasheet: "http://www.advanced-monolithic.com/pdf/ds1117.pdf", bbox: { x: 10, y: 35, w: 10, h: 12 } }
    ]
  },
  "arduino_mega": {
    id: "arduino_mega",
    name: "Arduino Mega 2560 Board (Roboflow Kaggle Dataset)",
    manufacturer: "Arduino",
    fpgaFamily: "AVR Microcontroller",
    deviceNumber: "ATmega2560-16AU",
    description: "Expanded microcontroller board with 54 digital I/O pins based on ATmega2560.",
    vccInt: "5.0V",
    vccO: "5.0V / 3.3V",
    goldComponents: [
      { id: "atmega2560", name: "Microchip ATmega2560 8-Bit MCU", type: "SMD Integrated Circuit (QFP/SOP/BGA)", confidence: 0.998, manufacturer: "Microchip / Atmel", partNumber: "ATmega2560-16AU", pins: "100-TQFP", voltage: "5.0V", function: "High-Pin Count 16MHz AVR Core", description: "256KB Flash Memory, 8KB SRAM, 4KB EEPROM, 54 Digital I/O pins.", applications: "3D Printers, Robotics, Complex Controllers", datasheet: "https://ww1.microchip.com/downloads/en/DeviceDoc/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf", bbox: { x: 38, y: 34, w: 26, h: 28 } },
      { id: "usb_ch340", name: "WCH CH340G USB-UART Interface", type: "SMD Integrated Circuit (QFP/SOP/BGA)", confidence: 0.974, manufacturer: "WCH", partNumber: "CH340G", pins: "16-SOP", voltage: "5.0V", function: "USB to Serial UART Conversion", description: "Full-speed USB device interface converter.", applications: "Board Serial Programming", datasheet: "http://www.wch-ic.com/downloads/CH340DS1_PDF.html", bbox: { x: 14, y: 18, w: 12, h: 14 } },
      { id: "header_array", name: "Dual 18-Pin GPIO Header Strips", type: "I/O Pin Header Connector", confidence: 0.989, manufacturer: "Amphenol", partNumber: "HEADER-2X18", pins: "36 Female Header Pins", voltage: "5.0V", function: "Digital GPIO Pin Array Expansion", description: "Dual-row 0.1 inch female socket header strip.", applications: "Shield & Peripheral Expansion", datasheet: "https://www.arduino.cc", bbox: { x: 70, y: 15, w: 24, h: 65 } }
    ]
  },
  "beaglebone_black": {
    id: "beaglebone_black",
    name: "BeagleBone Black SBC (Roboflow Kaggle Dataset)",
    manufacturer: "BeagleBoard.org / TI",
    fpgaFamily: "ARM Cortex-A8 Processor",
    deviceNumber: "AM3358BZCZ100",
    description: "Low-cost community-supported development platform featuring 1GHz Sitara AM3358 ARM Cortex-A8 processor.",
    vccInt: "1.1V / 1.8V",
    vccO: "3.3V / 5.0V",
    goldComponents: [
      { id: "am3358_soc", name: "Texas Instruments Sitara AM3358 ARM A8", type: "FPGA / SoC", confidence: 0.996, manufacturer: "Texas Instruments", partNumber: "AM3358BZCZ100", pins: "324-NFBGA", voltage: "1.1V (VDD_CORE)", function: "1GHz 32-Bit ARM Cortex-A8 MPU with SGX530 3D Graphics", description: "High performance Sitara processor with 2x 200MHz PRUs (Programmable Real-Time Units).", applications: "Embedded Industrial Control, High Speed Real-time Linux", datasheet: "https://www.ti.com/lit/ds/symlink/am3358.pdf", bbox: { x: 36, y: 32, w: 26, h: 28 } },
      { id: "emmc_flash", name: "Kingston 4GB eMMC 5.0 Onboard Flash", type: "Flash Memory", confidence: 0.987, manufacturer: "Kingston Technology", partNumber: "EMMC04G-W627-E01U", pins: "153-FBGA", voltage: "1.8V / 3.3V", function: "Debian Linux OS Storage", description: "4 Gigabyte high speed onboard eMMC non-volatile flash storage.", applications: "Embedded Bootloader & OS Storage", datasheet: "https://www.kingston.com", bbox: { x: 64, y: 32, w: 18, h: 22 } },
      { id: "tps65217c", name: "TI TPS65217C Power Management IC (PMIC)", type: "Voltage Regulator / PMIC", confidence: 0.978, manufacturer: "Texas Instruments", partNumber: "TPS65217C", pins: "48-VQFN", voltage: "1.1V, 1.8V, 3.3V", function: "Complete System Power Management & Battery Charger", description: "Integrated PMIC with 3 DC/DC step-down converters and 4 LDOs.", applications: "Power Distribution", datasheet: "https://www.ti.com/lit/ds/symlink/tps65217.pdf", bbox: { x: 14, y: 16, w: 14, h: 16 } }
    ]
  },
  "arduino_due": {
    id: "arduino_due",
    name: "Arduino Due ARM Cortex-M3 Board (Roboflow Kaggle Dataset)",
    manufacturer: "Arduino",
    fpgaFamily: "ARM Cortex-M3 Microcontroller",
    deviceNumber: "ATSAM3X8EA-AU",
    description: "32-bit ARM core microcontroller board based on the Atmel SAM3X8E ARM Cortex-M3 CPU.",
    vccInt: "3.3V",
    vccO: "3.3V",
    goldComponents: [
      { id: "sam3x8e", name: "Microchip ATSAM3X8E 32-Bit ARM M3 MCU", type: "SMD Integrated Circuit (QFP/SOP/BGA)", confidence: 0.994, manufacturer: "Microchip / Atmel", partNumber: "ATSAM3X8EA-AU", pins: "144-LQFP", voltage: "3.3V", function: "84MHz 32-Bit ARM Cortex-M3 Core", description: "512KB Flash Memory, 96KB SRAM, Dual 12-bit DAC, 12-bit ADC.", applications: "Complex Audio Synthesis, High Speed Measurement", datasheet: "https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-11100-32-bit-Cortex-M3-Microcontroller-SAM3X-SAM3A_Datasheet.pdf", bbox: { x: 36, y: 32, w: 28, h: 30 } }
    ]
  },
  "arduino_leonardo": {
    id: "arduino_leonardo",
    name: "Arduino Leonardo Board (Roboflow Kaggle Dataset)",
    manufacturer: "Arduino",
    fpgaFamily: "AVR Microcontroller",
    deviceNumber: "ATmega32U4-AU",
    description: "Microcontroller board featuring built-in USB communication directly on ATmega32U4.",
    vccInt: "5.0V",
    vccO: "5.0V / 3.3V",
    goldComponents: [
      { id: "atmega32u4", name: "Microchip ATmega32U4 8-Bit MCU with Native USB", type: "SMD Integrated Circuit (QFP/SOP/BGA)", confidence: 0.995, manufacturer: "Microchip / Atmel", partNumber: "ATmega32U4-AU", pins: "44-TQFP", voltage: "5.0V", function: "16MHz Core with Integrated USB 2.0 PHY", description: "32KB Flash Memory, 2.5KB SRAM, Native USB 2.0 CDC/HID controller.", applications: "USB Human Interface Devices (Keyboard/Mouse), Gamepads", datasheet: "https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7766-8-bit-AVR-ATmega16U4-32U4_Datasheet.pdf", bbox: { x: 36, y: 34, w: 26, h: 26 } }
    ]
  }
};
