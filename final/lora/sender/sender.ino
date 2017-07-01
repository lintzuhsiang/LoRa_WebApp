#include <SPI.h>
#include <LoRa.h>
#include <TinyGPS.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>
SoftwareSerial ss(3, 4); //Rx,Tx
TinyGPS gps;
int counter = 0;

static void smartdelay(unsigned long ms);
static void print_float(float val, float invalid, int len, int prec);
static void print_int(unsigned long val, unsigned long invalid, int len);
static void print_date(TinyGPS &gps);
static void print_str(const char *str, int len);

void setup() {
  Serial.begin(9600);
  ss.begin(9600);
  while (!Serial);
  Serial.println("LoRa Sender");

  if (!LoRa.begin(915E6)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }
}

char json[] =
  "{\"sensor\":\"gps\",\"time\":1351824120,\"id\",0,\"counter\":0,\"data\":[48.756080,2.302038]}";

//char json[] =
 // "{"sensor":"gps","time":1351824120,"id",0,"counter":0,"data":[48.756080,2.302038]}";
  
void loop() {
  float flat, flon;
  int id = 1;
  unsigned long age, date, time, chars = 0;
  unsigned short sentences = 0, failed = 0;
  int year;
  byte month, day, hour, minute, second, hundredths;
  char sz[32];
  
  //GPS
  gps.f_get_position(&flat, &flon, &age);
  gps.crack_datetime(&year, &month, &day, &hour, &minute, &second, &hundredths, &age);
  sprintf(sz, "%02d/%02d/%02d %02d:%02d:%02d ",
          month, day, year, hour, minute, second);
  Serial.println();
  Serial.println(flat);
  Serial.println(flon);
  Serial.println();
  //Json
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root =jsonBuffer.createObject();
  root["sensor"] = "gps";
  root["time"] = sz;
  root["counter"]= counter;
  root["id"]=id;
 //JsonArray& data = root.createNestedArray("data");
  //data.add(flat);
  //data.add(flon);
  root["lat"]=flat;
  root["lng"]=flon;
  root["speed"]=gps.f_speed_kmph();
  smartdelay(1000);
  //Lora  
  Serial.print("Sending packet: ");
  LoRa.beginPacket();
  root.printTo(Serial);
  root.printTo(LoRa);
  // send packet
  //LoRa.print(json);
  LoRa.endPacket();

  counter++;

  delay(5000);
}



static void print_date(TinyGPS &gps)
{
  int year;
  byte month, day, hour, minute, second, hundredths;
  unsigned long age;
  gps.crack_datetime(&year, &month, &day, &hour, &minute, &second, &hundredths, &age);
  if (age == TinyGPS::GPS_INVALID_AGE)
    Serial.print("********** ******** ");
  else
  {
    char sz[32];
    sprintf(sz, "%02d/%02d/%02d %02d:%02d:%02d ",
            month, day, year, hour, minute, second);
    Serial.print(sz);
  }
  print_int(age, TinyGPS::GPS_INVALID_AGE, 5);
  smartdelay(0);
}


static void print_int(unsigned long val, unsigned long invalid, int len)
{
  char sz[32];
  if (val == invalid)
    strcpy(sz, "*******");
  else
    sprintf(sz, "%ld", val);
  sz[len] = 0;
  for (int i = strlen(sz); i < len; ++i)
    sz[i] = ' ';
  if (len > 0)
    sz[len - 1] = ' ';
  Serial.print(sz);
  smartdelay(0);
}



static void print_float(float val, float invalid, int len, int prec)
{
  if (val == invalid)
  {
    while (len-- > 1)
      Serial.print('*');
    Serial.print(' ');
  }
  else
  {
    Serial.print(val, prec);
    int vi = abs((int)val);
    int flen = prec + (val < 0.0 ? 2 : 1); // . and -
    flen += vi >= 1000 ? 4 : vi >= 100 ? 3 : vi >= 10 ? 2 : 1;
    for (int i = flen; i < len; ++i)
      Serial.print(' ');
  }
  smartdelay(0);
}

static void smartdelay(unsigned long ms)
{
  unsigned long start = millis();
  do
  {
    while (ss.available())
      gps.encode(ss.read());
  } while (millis() - start < ms);
}

