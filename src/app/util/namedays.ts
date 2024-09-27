import { isNumber } from './util';

/* Nimipäivät vuonna 2007 */
const nameDays: string[][][] = [];
for (let i = 0; i <= 12; i++) {
  const m: string[][] = [];
  for (let j = 0; j <= 31; j++) {
    m.push([]);
  }
  nameDays.push(m);
}

nameDays[1][2] = ['Aapeli'];
nameDays[1][3] = ['Elmo', 'Elmeri', 'Elmer'];
nameDays[1][4] = ['Ruut'];
nameDays[1][5] = ['Lea', 'Leea'];
nameDays[1][6] = ['Harri'];
nameDays[1][7] = ['Aku', 'Aukusti', 'August'];
nameDays[1][8] = ['Titta', 'Hilppa'];
nameDays[1][9] = ['Veikko', 'Veli', 'Veijo', 'Veikka'];
nameDays[1][10] = ['Nyyrikki'];
nameDays[1][11] = ['Kari', 'Karri'];
nameDays[1][12] = ['Toini'];
nameDays[1][13] = ['Nuutti'];
nameDays[1][14] = ['Sakari', 'Saku'];
nameDays[1][15] = ['Solja'];
nameDays[1][16] = ['Ilmari', 'Ilmo'];
nameDays[1][17] = ['Toni', 'Anton', 'Anttoni', 'Antto'];
nameDays[1][18] = ['Laura'];
nameDays[1][19] = ['Heikki', 'Henrik', 'Henri', 'Henrikki'];
nameDays[1][20] = ['Henna', 'Henni', 'Henriikka'];
nameDays[1][21] = ['Aune', 'Oona', 'Netta', 'Auni'];
nameDays[1][22] = ['Visa'];
nameDays[1][23] = ['Enni', 'Eine', 'Eini'];
nameDays[1][24] = ['Senja'];
nameDays[1][25] = ['Paavo', 'Pauli', 'Paul', 'Paavali'];
nameDays[1][26] = ['Joonatan'];
nameDays[1][27] = ['Viljo'];
nameDays[1][28] = ['Kalle', 'Kaarlo', 'Kaarle', 'Mies'];
nameDays[1][29] = ['Valtteri'];
nameDays[1][30] = ['Irja'];
nameDays[1][31] = ['Alli'];
nameDays[2][1] = ['Riitta'];
nameDays[2][2] = ['Jemina', 'Aamu'];
nameDays[2][3] = ['Valo'];
nameDays[2][4] = ['Armi', 'Ronja'];
nameDays[2][5] = ['Asser'];
nameDays[2][6] = ['Terhi', 'Teija', 'Tiia', 'Tea', 'Terhikki'];
nameDays[2][7] = ['Riku', 'Rikhard'];
nameDays[2][8] = ['Laina'];
nameDays[2][9] = ['Raija', 'Raisa'];
nameDays[2][10] = ['Elina', 'Ella', 'Ellen', 'Elna'];
nameDays[2][11] = ['Talvikki'];
nameDays[2][12] = ['Elma', 'Elmi'];
nameDays[2][13] = ['Sulo', 'Sulho'];
nameDays[2][14] = ['Voitto', 'Valentin', 'Tino'];
nameDays[2][15] = ['Sipi', 'Sippo'];
nameDays[2][16] = ['Kai'];
nameDays[2][17] = ['Väinö', 'Väinämö'];
nameDays[2][18] = ['Kaino'];
nameDays[2][19] = ['Eija'];
nameDays[2][20] = ['Heli', 'Helinä', 'Heljä', 'Hely'];
nameDays[2][21] = ['Keijo'];
nameDays[2][22] = ['Tuulikki', 'Tuuli', 'Tuulia'];
nameDays[2][23] = ['Aslak'];
nameDays[2][24] = ['Matti', 'Matias'];
nameDays[2][25] = ['Tuija', 'Tuire'];
nameDays[2][26] = ['Nestori'];
nameDays[2][27] = ['Torsti'];
nameDays[2][28] = ['Onni'];
nameDays[3][1] = ['Alpo', 'Alvi', 'Alpi'];
nameDays[3][2] = ['Virve', 'Virva'];
nameDays[3][3] = ['Kauko'];
nameDays[3][4] = ['Ari', 'Arsi', 'Atro'];
nameDays[3][5] = ['Leila', 'Laila'];
nameDays[3][6] = ['Tarmo'];
nameDays[3][7] = ['Taika', 'Tarja', 'Taru'];
nameDays[3][8] = ['Vilppu'];
nameDays[3][9] = ['Auvo'];
nameDays[3][10] = ['Aurora', 'Aura', 'Auri'];
nameDays[3][11] = ['Kalervo'];
nameDays[3][12] = ['Reijo', 'Reko'];
nameDays[3][13] = ['Erno', 'Ernesti', 'Tarvo'];
nameDays[3][14] = ['Matilda', 'Mette', 'Tilda'];
nameDays[3][15] = ['Risto'];
nameDays[3][16] = ['Ilkka'];
nameDays[3][17] = ['Kerttu', 'Kerttuli'];
nameDays[3][18] = ['Eetu', 'Edvard'];
nameDays[3][19] = ['Juuso', 'Josefina', 'Jooseppi', 'Joosef'];
nameDays[3][20] = ['Aki', 'Kim', 'Joakim', 'Jaakkima'];
nameDays[3][21] = ['Pentti'];
nameDays[3][22] = ['Vihtori'];
nameDays[3][23] = ['Akseli'];
nameDays[3][24] = ['Gabriel', 'Kaapo', 'Kaapro', 'Kaappo'];
nameDays[3][25] = ['Aija'];
nameDays[3][26] = ['Manu', 'Manne', 'Immanuel', 'Immo'];
nameDays[3][27] = ['Sauli', 'Saul'];
nameDays[3][28] = ['Armas'];
nameDays[3][29] = ['Jouni', 'Joni', 'Joonas', 'Joona', 'Jonne', 'Jonni'];
nameDays[3][30] = ['Usko'];
nameDays[3][31] = ['Irma', 'Irmeli'];
nameDays[4][1] = ['Raita', 'Pulmu'];
nameDays[4][2] = ['Pellervo'];
nameDays[4][3] = ['Sampo', 'Veeti'];
nameDays[4][4] = ['Ukko'];
nameDays[4][5] = ['Irene', 'Irina', 'Ira', 'Iro'];
nameDays[4][6] = ['Ville', 'Vilho', 'Vilhelm', 'Viljami', 'Vili', 'Jami'];
nameDays[4][7] = ['Allan', 'Ahvo'];
nameDays[4][8] = ['Suometar'];
nameDays[4][9] = ['Elias', 'Eelis', 'Eeli', 'Eljas'];
nameDays[4][10] = ['Tero'];
nameDays[4][11] = ['Verna'];
nameDays[4][12] = ['Julia', 'Julius', 'Juliaana', 'Janna'];
nameDays[4][13] = ['Tellervo'];
nameDays[4][14] = ['Taito'];
nameDays[4][15] = ['Linda', 'Tuomi'];
nameDays[4][16] = ['Jalo', 'Patrik'];
nameDays[4][17] = ['Otto'];
nameDays[4][18] = ['Valto', 'Valdemar'];
nameDays[4][19] = ['Pilvi', 'Pälvi'];
nameDays[4][20] = ['Lauha'];
nameDays[4][21] = ['Anssi', 'Anselmi'];
nameDays[4][22] = ['Alina'];
nameDays[4][23] = ['Yrjö', 'Jyrki', 'Jyri', 'Jori', 'Yrjänä'];
nameDays[4][24] = ['Pertti', 'Albert', 'Altti'];
nameDays[4][25] = ['Markku', 'Marko', 'Markus'];
nameDays[4][26] = ['Terttu', 'Teresa'];
nameDays[4][27] = ['Merja'];
nameDays[4][28] = ['Ilpo', 'Tuure', 'Ilppo'];
nameDays[4][29] = ['Teijo'];
nameDays[4][30] = ['Mirja', 'Miia', 'Mira', 'Mirva', 'Mirjami', 'Mirka', 'Mirkka'];
nameDays[5][1] = ['Vappu', 'Valpuri'];
nameDays[5][2] = ['Vuokko', 'Viivi'];
nameDays[5][3] = ['Outi'];
nameDays[5][4] = ['Roosa', 'Ruusu'];
nameDays[5][5] = ['Maini'];
nameDays[5][6] = ['Ylermi'];
nameDays[5][7] = ['Helmi', 'Kastehelmi'];
nameDays[5][8] = ['Heino'];
nameDays[5][9] = ['Timo'];
nameDays[5][10] = ['Aino', 'Aini', 'Aina', 'Ainikki'];
nameDays[5][11] = ['Osmo'];
nameDays[5][12] = ['Lotta'];
nameDays[5][13] = ['Kukka', 'Floora'];
nameDays[5][14] = ['Tuula'];
nameDays[5][15] = ['Sofia', 'Sonja', 'Sohvi'];
nameDays[5][16] = ['Ester', 'Essi', 'Esteri'];
nameDays[5][17] = ['Maila', 'Mailis', 'Maili', 'Rebekka'];
nameDays[5][18] = ['Erkki', 'Eero', 'Eerik', 'Eerika', 'Eerikki'];
nameDays[5][19] = ['Emilia', 'Emma', 'Emmia', 'Milla', 'Milja', 'Milka', 'Amalia'];
nameDays[5][20] = ['Lilja', 'Karoliina', 'Lilli'];
nameDays[5][21] = ['Kosti', 'Konsta', 'Konstantin'];
nameDays[5][22] = ['Hemminki', 'Hemmo'];
nameDays[5][23] = ['Lyydia', 'Lyyli'];
nameDays[5][24] = ['Tuukka', 'Touko'];
nameDays[5][25] = ['Urpo'];
nameDays[5][26] = ['Minna', 'Vilma', 'Vilhelmiina', 'Miina', 'Mimmi'];
nameDays[5][27] = ['Ritva'];
nameDays[5][28] = ['Alma'];
nameDays[5][29] = ['Oiva', 'Oliver', 'Olivia', 'Oivi'];
nameDays[5][30] = ['Pasi'];
nameDays[5][31] = ['Helka', 'Helga'];
nameDays[6][1] = ['Teemu', 'Nikodemus'];
nameDays[6][2] = ['Venla'];
nameDays[6][3] = ['Orvokki', 'Viola'];
nameDays[6][4] = ['Toivo'];
nameDays[6][5] = ['Sulevi'];
nameDays[6][6] = ['Kustaa', 'Kyösti', 'Kustavi'];
nameDays[6][7] = ['Suvi', 'Roope', 'Robert'];
nameDays[6][8] = ['Salomon', 'Salomo'];
nameDays[6][9] = ['Ensio'];
nameDays[6][10] = ['Seppo'];
nameDays[6][11] = ['Impi', 'Immi'];
nameDays[6][12] = ['Esko'];
nameDays[6][13] = ['Raili', 'Raila'];
nameDays[6][14] = ['Kielo', 'Pihla'];
nameDays[6][15] = ['Vieno', 'Moona', 'Viena'];
nameDays[6][16] = ['Päivi', 'Päivikki', 'Päivä'];
nameDays[6][17] = ['Urho'];
nameDays[6][18] = ['Tapio'];
nameDays[6][19] = ['Siiri'];
nameDays[6][20] = ['Into'];
nameDays[6][21] = ['Ahti', 'Ahto'];
nameDays[6][22] = ['Paula', 'Pauliina', 'Liina'];
nameDays[6][23] = ['Aatu', 'Aatto', 'Aadolf'];
nameDays[6][24] = [
  'Johannes',
  'Juhani',
  'Juha',
  'Jukka',
  'Janne',
  'Juho',
  'Jani',
  'Jussi',
  'Juhana',
];
nameDays[6][25] = ['Uuno'];
nameDays[6][26] = ['Jorma', 'Jarmo', 'Jarkko', 'Jarno', 'Jere', 'Jeremias'];
nameDays[6][27] = ['Elviira', 'Elvi'];
nameDays[6][28] = ['Leo'];
nameDays[6][29] = ['Pekka', 'Petri', 'Petra', 'Petteri', 'Pietari', 'Pekko'];
nameDays[6][30] = ['Päiviö', 'Päivö'];
nameDays[7][1] = ['Aaro', 'Aaron'];
nameDays[7][2] = [
  'Maria',
  'Maija',
  'Mari',
  'Meeri',
  'Marika',
  'Maiju',
  'Maaria',
  'Maikki',
  'Kukka-Maaria',
];
nameDays[7][3] = ['Arvo'];
nameDays[7][4] = ['Ulla', 'Ulpu'];
nameDays[7][5] = ['Unto', 'Untamo'];
nameDays[7][6] = ['Esa', 'Esaias'];
nameDays[7][7] = ['Klaus', 'Launo'];
nameDays[7][8] = ['Turo', 'Turkka'];
nameDays[7][9] = ['Jasmin', 'Ilta'];
nameDays[7][10] = ['Saima', 'Saimi'];
nameDays[7][11] = ['Elli', 'Noora', 'Nelli', 'Eleonoora'];
nameDays[7][12] = ['Hermanni', 'Herkko', 'Herman'];
nameDays[7][13] = ['Joel', 'Ilari', 'Lari'];
nameDays[7][14] = ['Aliisa', 'Alisa'];
nameDays[7][15] = ['Rauni', 'Rauna'];
nameDays[7][16] = ['Reino'];
nameDays[7][17] = ['Ossi', 'Ossian'];
nameDays[7][18] = ['Riikka'];
nameDays[7][19] = ['Sari', 'Saara', 'Sara', 'Salla', 'Salli'];
nameDays[7][20] = ['Marketta', 'Maarit', 'Reetta', 'Reeta', 'Maaret', 'Margareeta'];
nameDays[7][21] = ['Johanna', 'Hanna', 'Jenni', 'Jenna', 'Jonna', 'Hannele', 'Hanne', 'Joanna'];
nameDays[7][22] = ['Leena', 'Matleena', 'Leeni', 'Lenita'];
nameDays[7][23] = ['Olga', 'Oili'];
nameDays[7][24] = ['Kristiina', 'Tiina', 'Kirsti', 'Kirsi', 'Krista', 'Kiia'];
nameDays[7][25] = ['Jaakko', 'Jaakob', 'Jimi', 'Jaakoppi'];
nameDays[7][26] = ['Martta'];
nameDays[7][27] = ['Heidi'];
nameDays[7][28] = ['Atso'];
nameDays[7][29] = ['Olavi', 'Olli', 'Uolevi', 'Uoti'];
nameDays[7][30] = ['Asta'];
nameDays[7][31] = ['Helena', 'Elena'];
nameDays[8][1] = ['Maire'];
nameDays[8][2] = ['Kimmo'];
nameDays[8][3] = ['Nea', 'Linnea', 'Neea', 'Vanamo'];
nameDays[8][4] = ['Veera'];
nameDays[8][5] = ['Salme', 'Sanelma'];
nameDays[8][6] = ['Toimi', 'Keimo'];
nameDays[8][7] = ['Lahja'];
nameDays[8][8] = ['Sylvi', 'Sylvia', 'Silva'];
nameDays[8][9] = ['Erja', 'Eira'];
nameDays[8][10] = ['Lauri', 'Lasse', 'Lassi'];
nameDays[8][11] = ['Sanna', 'Susanna', 'Sanni', 'Susanne'];
nameDays[8][12] = ['Klaara'];
nameDays[8][13] = ['Jesse'];
nameDays[8][14] = ['Onerva', 'Kanerva'];
nameDays[8][15] = [
  'Marjatta',
  'Marja',
  'Jaana',
  'Marjo',
  'Marita',
  'Marjut',
  'Marianne',
  'Maritta',
  'Marjaana',
  'Marjukka',
  'Marianna',
];
nameDays[8][16] = ['Aulis'];
nameDays[8][17] = ['Verneri'];
nameDays[8][18] = ['Leevi'];
nameDays[8][19] = ['Mauno', 'Maunu'];
nameDays[8][20] = ['Sami', 'Samuli', 'Samu', 'Samuel'];
nameDays[8][21] = ['Soini', 'Veini'];
nameDays[8][22] = ['Iivari', 'Iivo'];
nameDays[8][23] = ['Signe', 'Varma'];
nameDays[8][24] = ['Perttu'];
nameDays[8][25] = ['Loviisa'];
nameDays[8][26] = ['Ilmi', 'Ilma', 'Ilmatar'];
nameDays[8][27] = ['Rauli'];
nameDays[8][28] = ['Tauno'];
nameDays[8][29] = ['Iina', 'Iines', 'Inari'];
nameDays[8][30] = ['Eemil', 'Eemeli'];
nameDays[8][31] = ['Arvi'];
nameDays[9][1] = ['Pirkka'];
nameDays[9][2] = ['Sinikka', 'Sini'];
nameDays[9][3] = ['Soile', 'Soili', 'Soila'];
nameDays[9][4] = ['Ansa'];
nameDays[9][5] = ['Roni', 'Mainio'];
nameDays[9][6] = ['Asko'];
nameDays[9][7] = ['Miro', 'Arho', 'Arhippa'];
nameDays[9][8] = ['Taimi'];
nameDays[9][9] = ['Eevert', 'Isto'];
nameDays[9][10] = ['Kalevi', 'Kaleva'];
nameDays[9][11] = ['Santeri', 'Aleksanteri', 'Aleksandra', 'Santtu', 'Ali', 'Ale'];
nameDays[9][12] = ['Valma', 'Vilja'];
nameDays[9][13] = ['Orvo'];
nameDays[9][14] = ['Iida'];
nameDays[9][15] = ['Sirpa'];
nameDays[9][16] = ['Hilla', 'Hellevi', 'Hillevi', 'Hille'];
nameDays[9][17] = ['Aili', 'Aila'];
nameDays[9][18] = ['Tyyne', 'Tytti', 'Tyyni'];
nameDays[9][19] = ['Reija'];
nameDays[9][20] = ['Varpu', 'Vaula'];
nameDays[9][21] = ['Mervi'];
nameDays[9][22] = ['Mauri'];
nameDays[9][23] = ['Mielikki'];
nameDays[9][24] = ['Alvar', 'Auno'];
nameDays[9][25] = ['Kullervo'];
nameDays[9][26] = ['Kuisma'];
nameDays[9][27] = ['Vesa'];
nameDays[9][28] = ['Arja'];
nameDays[9][29] = ['Mikko', 'Mika', 'Mikael', 'Miika', 'Miikka', 'Miska', 'Miko', 'Mikaela'];
nameDays[9][30] = ['Sirja', 'Sorja'];
nameDays[10][1] = ['Rauno', 'Rainer', 'Raine', 'Raino'];
nameDays[10][2] = ['Valio'];
nameDays[10][3] = ['Raimo'];
nameDays[10][4] = ['Saija', 'Saila'];
nameDays[10][5] = ['Inkeri', 'Inka'];
nameDays[10][6] = ['Pinja', 'Minttu'];
nameDays[10][7] = ['Pirkko', 'Pirjo', 'Pipsa', 'Piritta', 'Pirita', 'Birgitta'];
nameDays[10][8] = ['Hilja'];
nameDays[10][9] = ['Ilona'];
nameDays[10][10] = ['Aleksi', 'Aleksis'];
nameDays[10][11] = ['Otso', 'Ohto'];
nameDays[10][12] = ['Aarre', 'Aarto'];
nameDays[10][13] = ['Taina', 'Tanja', 'Taija'];
nameDays[10][14] = ['Elsa', 'Else', 'Elsi'];
nameDays[10][15] = ['Helvi', 'Heta'];
nameDays[10][16] = ['Sirkka', 'Sirkku'];
nameDays[10][17] = ['Saana', 'Saini'];
nameDays[10][18] = ['Satu', 'Säde'];
nameDays[10][19] = ['Uljas'];
nameDays[10][20] = ['Kasperi', 'Kauno'];
nameDays[10][21] = ['Ursula'];
nameDays[10][22] = ['Anja', 'Anita', 'Anniina', 'Anitta'];
nameDays[10][23] = ['Severi'];
nameDays[10][24] = ['Rasmus', 'Asmo'];
nameDays[10][25] = ['Sointu'];
nameDays[10][26] = ['Niina', 'Nina', 'Amanda', 'Manta'];
nameDays[10][27] = ['Helli', 'Hellin', 'Hellä', 'Helle'];
nameDays[10][28] = ['Simo'];
nameDays[10][29] = ['Alfred', 'Urmas'];
nameDays[10][30] = ['Eila'];
nameDays[10][31] = ['Arto', 'Arttu', 'Artturi'];
nameDays[11][1] = ['Pyry', 'Lyly'];
nameDays[11][2] = ['Topi', 'Topias'];
nameDays[11][3] = ['Terho'];
nameDays[11][4] = ['Hertta'];
nameDays[11][5] = ['Reima'];
nameDays[11][6] = ['Kustaa Aadolf'];
nameDays[11][7] = ['Taisto'];
nameDays[11][8] = ['Aatos'];
nameDays[11][9] = ['Teuvo'];
nameDays[11][10] = ['Martti'];
nameDays[11][11] = ['Panu'];
nameDays[11][12] = ['Virpi'];
nameDays[11][13] = ['Kristian', 'Ano'];
nameDays[11][14] = ['Iiris'];
nameDays[11][15] = ['Janina', 'Janika', 'Janita', 'Janette'];
nameDays[11][16] = ['Aarne', 'Aarno', 'Aarni'];
nameDays[11][17] = ['Eino', 'Einari'];
nameDays[11][18] = ['Tenho', 'Jousia'];
nameDays[11][19] = ['Liisa', 'Elisa', 'Eliisa', 'Liisi', 'Elisabet', 'Elise'];
nameDays[11][20] = ['Jari', 'Jalmari'];
nameDays[11][21] = ['Hilma'];
nameDays[11][22] = ['Silja', 'Selja'];
nameDays[11][23] = ['Ismo'];
nameDays[11][24] = ['Lempi', 'Lemmikki', 'Sivi'];
nameDays[11][25] = [
  'Katri',
  'Kaija',
  'Katja',
  'Kaisa',
  'Kati',
  'Kaarina',
  'Kaisu',
  'Riina',
  'Katariina',
  'Katriina',
];
nameDays[11][26] = ['Sisko'];
nameDays[11][27] = ['Hilkka'];
nameDays[11][28] = ['Heini'];
nameDays[11][29] = ['Aimo'];
nameDays[11][30] = ['Antti', 'Antero', 'Atte'];
nameDays[12][1] = ['Oskari'];
nameDays[12][2] = ['Anelma', 'Unelma'];
nameDays[12][3] = ['Meri', 'Vellamo'];
nameDays[12][4] = ['Airi', 'Aira'];
nameDays[12][5] = ['Selma'];
nameDays[12][6] = ['Niilo', 'Niko', 'Nikolai', 'Niklas'];
nameDays[12][7] = ['Sampsa'];
nameDays[12][8] = ['Kyllikki', 'Kylli'];
nameDays[12][9] = ['Anna', 'Anne', 'Anni', 'Anu', 'Anneli', 'Annikki', 'Annika', 'Annukka'];
nameDays[12][10] = ['Jutta'];
nameDays[12][11] = ['Tatu', 'Taneli', 'Daniel'];
nameDays[12][12] = ['Tuovi'];
nameDays[12][13] = ['Seija'];
nameDays[12][14] = ['Jouko'];
nameDays[12][15] = ['Heimo'];
nameDays[12][16] = ['Auli', 'Aulikki', 'Aada'];
nameDays[12][17] = ['Raakel'];
nameDays[12][18] = ['Aapo', 'Rami', 'Aappo'];
nameDays[12][19] = ['Iiro', 'Iisakki', 'Iikka', 'Isko'];
nameDays[12][20] = ['Benjamin', 'Kerkko'];
nameDays[12][21] = ['Tuomas', 'Tomi', 'Tommi', 'Tuomo'];
nameDays[12][22] = ['Raafael'];
nameDays[12][23] = ['Senni'];
nameDays[12][24] = ['Aatami', 'Eeva', 'Eevi', 'Eveliina'];
nameDays[12][26] = ['Tapani', 'Teppo', 'Tahvo'];
nameDays[12][27] = ['Hannu', 'Hannes'];
nameDays[12][28] = ['Piia'];
nameDays[12][29] = ['Rauha'];
nameDays[12][30] = ['Taavetti', 'Taavi', 'Daavid'];
nameDays[12][31] = ['Sylvester', 'Silvo'];
nameDays[1][1] = ['Uudenvuodenpäivä'];
nameDays[12][25] = ['Joulupäivä'];

export default nameDays;

export function getNameDay(month: number, day: number): string | undefined {
  return isNumber(month) &&
    isNumber(day) &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= 31 &&
    nameDays[month][day]
    ? nameDays[month][day].join(', ')
    : undefined;
}

export interface MonthDay {
  readonly month: number;
  readonly day: number;
}

type MonthDayMap = Record<string, MonthDay>;

const byName = {
  defined: false,
  names: [] as string[],
  nameDays: {} as MonthDayMap,
};

function canonName(name: string): string {
  return name.toLowerCase();
}

function shownName(name: string): string {
  return name.length > 0 ? name.substring(0, 1).toUpperCase().concat(name.substring(1)) : '';
}

function calculateByName(): void {
  for (let m = 1; m <= 12; ++m) {
    for (let d = 1; d <= 31; ++d) {
      const names = nameDays[m][d] || ([] as string[]);
      if (names) {
        names.map(canonName).forEach(name => {
          byName.names.push(name);
          byName.nameDays[name] = { month: m, day: d };
        });
      }
    }
  }
  byName.names = byName.names.sort();
  byName.defined = true;
}

export function getNameDayFor(name: string): MonthDay | undefined {
  if (!byName.defined) {
    calculateByName();
  }
  const cn = canonName(name);
  return byName.nameDays[cn];
}

export function findNameDayFor(name: string): MonthDayMap {
  if (!byName.defined) {
    calculateByName();
  }
  const cn = canonName(name);
  const resp: MonthDayMap = {};
  byName.names
    .filter(n => n.startsWith(cn))
    .forEach(n => (resp[shownName(n)] = byName.nameDays[n]));
  return resp;
}

export function getAllNames(): string[] {
  if (!byName.defined) {
    calculateByName();
  }
  return byName.names;
}
