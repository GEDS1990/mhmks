var sqlmap = {
  log:'insert into loginfo (logtime,userid,loginfo) values (?,?,?)',
  login_web: 'select a.*,b.name departname,b.userid from user a LEFT JOIN department b on (a.depart = b.id) where username = ? and password = ?',
  login_app: 'select a.*,b.name departname,b.userid from user a LEFT JOIN department b on (a.depart = b.id) where username = ? and password = ? and enableapp = 1',
  getstorearea: 'select * from store_area',
  getstorebasic: 'SELECT store.*, System_name,Region_name,Contacts_name,Tel,user.realname from store left join store_area on (store.System_id=store_area.System_id AND store.Region_id=store_area.Region_id ) INNER JOIN store_contacts on (store_contacts.Store_id = store.Store_id) left join user on (store.user_id = user.username)',
  getstorecontacts: 'select store_contacts.*,Store_name from store_contacts left join store on (store_contacts.Store_id = store.Store_id)',
  getstoredisplay: 'select * from store_display',
  getproduct: 'select * from product',
  getproductpricecount: 'select count(*) from product_price',
  getproductprice: 'select product_price.*,Store_name,Product_name from product_price left join store on (product_price.Store_id = store.Store_id ) left join product on (product_price.Product_id = product.Product_id) limit ?,10',
  getproductstockcount: 'select count(*) from product_stock',
  getproductstock: 'select product_stock.*,Store_name,Product_name from product_stock left join store on (product_stock.Store_id = store.Store_id ) left join product on (product_stock.Product_id = product.Product_id) limit ?,10',
  getproductbrand: 'select * from product_brand',
  getpromotiontype: 'select * from promotion_type order by promotion_type',
  getpromotioncount: 'select count(*) from promotion',
  getpromotion: 'select promotion.*,Store_name,Product_name from promotion left join store on (promotion.Store_id = store.Store_id ) left join product on (promotion.Product_id = product.Product_id) left join promotion_type on (promotion.Promotion_type = promotion_type.Promotion_type) limit ?,10',
  getuser: 'select * from user',
  adduser: 'insert into user(username,password,realname,phone,email,depart,role,enableweb,enableapp) values(?,?,?,?,?,?,?,?,?)',
  moduser: 'update user set username = ? , password = ?, realname = ?, phone = ?, email = ?, depart = ?, role = ?, enableweb = ?, enableapp = ? where id = ?',
  deluser: 'delete from user where id = ?',
  getdepart: 'select * from department',
  adddepart: 'insert into department(name,parentid,userid,path) values(?,?,?,?)',
  moddepart: 'update department set name = ? , userid = ? , path = ? where id = ?',
  deldepart: 'delete from department where id = ?',
  getpermissontype: 'select * from permissontype',
  getrole: 'select * from role',
  addrole: 'insert into role(name,permisson) values(?,?)',
  modrole: 'update role set name = ? , permisson = ? where id = ?',
  delrole: 'delete from role where id = ?',
  getpath: 'select * from path',
  getpathdetail: 'select a.*,b.Store_name from path_detail a INNER JOIN store b on(a.Store_id = b.Store_id)',
  getpath_app: 'select a.*,Path_name,Store_name from path_detail a INNER JOIN path b on (a.path_id = b.path_id) INNER JOIN store c on (a.store_id = c.store_id) where c.store_id in (select store_id from store where user_id = ?) order by a.path_seq,a.Path_id',
  getplan: 'select a.*,b.Path_Name,c.Store_name,c.Gps_x,c.Gps_y from plan a LEFT JOIN path b ON (a.Path_Id = b.Path_id) LEFT JOIN store c on (c.Store_id = a.store_id)',
  addplan: 'insert into plan (Plan_Type,Plan_Date,Path_Id,Store_Id,Store_Name,User_Id) values (?,?,?,?,?,?)',
  delplan: 'delete from plan where userid = ? and year = ? and month = ? and day = ?',
  getplansum: 'select * from plan_sum where userid = ? and year = ?',
  updateplansum: 'replace into plan_sum(userid,year,month,storeCount,storeACount,storeBCount,storeCCount,storeA,storeB,storeC,cover) VALUES(?,?,?,?,?,?,?,?,?,?,?) ',
  insertplan: 'insert into plan(userid,year,month,day,plan_date,plan_type,path_id,store_id) values(?,?,?,?,?,?,?,?) ',
  getstoreproduct: 'select a.*,b.Product_name,b.Brand_id from product_price a INNER JOIN product b on(a.Product_id = b.product_id) where Store_id = ?',
  signin: 'update plan set signin_time=?,signin_gps_x=?,signin_gps_y=? where userid=? and year=? and month=? and day=? and store_id=? ',
  signout: 'update plan set signout_time=?,signout_gps_x=?,signout_gps_y=?,isfinish=1 where userid=? and year=? and month=? and day=? and store_id=? ',
  checksign: 'insert into sign_check (signtime,gps_x,gps_y,userid) values (?,?,?,?)',
  getsignlist: 'select * from sign_check where userid=? and signtime like ?',
  getproductbystore: 'select a.*,b.Product_name,b.Brand_id from product_price a left join store c on (a.Store_id = c.Store_id ) left join product b on (a.Product_id = b.Product_id) where a.store_id = ?',
  submitproductimage: 'replace into product_image (store_id,brand_id,display_id,product_id,user_id,year,month,day,filename,type,category) values(?,?,?,?,?,?,?,?,?,?,?)',
  submitshelfmain: 'replace into visitor_shelfmain (store_id,product_id,user_id,year,month,day,count) values(?,?,?,?,?,?,?)',
  delshelfmain: 'delete from visitor_shelfmain where year = ? and month = ? and day = ? and store_id = ? and user_id = ?',
  submitstock: 'replace into visitor_stock (store_id,product_id,user_id,year,month,day,count) values(?,?,?,?,?,?,?)',
  delstock: 'delete from visitor_stock where year = ? and month = ? and day = ? and store_id = ? and user_id = ?',
  submitshelfaway: 'replace into visitor_shelfaway (store_id,product_id,user_id,year,month,day,display_id) values(?,?,?,?,?,?,?)',
  submitshelfawaycount: 'replace into visitor_shelfaway_count (store_id,user_id,year,month,day,display_id,count) values(?,?,?,?,?,?,?)',
  delshelfaway: 'delete from visitor_shelfaway where year = ? and month = ? and day = ? and store_id = ? and user_id = ?',
  submitchat: 'replace into visitor_chat (store_id,user_id,year,month,day,storeuser,chatcontent,chatresult) values(?,?,?,?,?,?,?,?)',
  getpromotionbystore: 'select b.promotion_name,c.product_name,a.* from promotion a LEFT JOIN promotion_type b on a.Promotion_type = b.Promotion_type LEFT JOIN product c on c.Product_id = a.product_id where Store_id = ? and date4 >= ?',
  submitpromotion: 'replace into visitor_promotion (store_id,product_id,user_id,year,month,day,display_id,pos,count,user_confirm) values(?,?,?,?,?,?,?,?,?,?)',
  delpromotion: 'delete from visitor_promotion where year = ? and month = ? and day = ? and store_id = ? and user_id = ?',
  getvisitorplan: 'select b.Store_name,b.Gps_x,b.Gps_y,c.realname,d.path_name,a.* from plan a LEFT JOIN store b ON (a.store_id = b.Store_id) LEFT JOIN user c ON (a.userid = c.username) LEFT JOIN path d ON (a.path_id = d.path_id) where (userid like ? or realname like ?) and plan_date BETWEEN ? and ? order by a.plan_date desc',
  getvisitorimage: 'select * from product_image where year = ? and month = ? and day = ? and store_id = ? and user_id = ?',
  getshelfmain: 'select * from visitor_shelfmain where year= ? and month = ? and day = ? and store_id = ? and user_id = ?',
  getstock: 'select * from visitor_stock where year= ? and month = ? and day = ? and store_id = ? and user_id = ?',
  getshelfaway: 'select * from visitor_shelfaway where year= ? and month = ? and day = ? and store_id = ? and user_id = ?',
  getshelfawaycount: 'select * from visitor_shelfaway_count where year= ? and month = ? and day = ? and store_id = ? and user_id = ?',
  getstorepromotion: 'select * from visitor_promotion where year= ? and month = ? and day = ? and store_id = ? and user_id = ?',
  getchat: 'select * from visitor_chat where year= ? and month = ? and day = ? and store_id = ? and user_id = ?',
};

module.exports = sqlmap;
