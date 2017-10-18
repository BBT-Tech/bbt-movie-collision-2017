# bbt-movie-collision-2017建库语句

标签： sql bbt-movie-collision-2017

---

```sql
CREATE TABLE `bbt-movie-collision-2017`.`complete` (
  `name` VARCHAR(20) NOT NULL,
  `gender` INT NOT NULL,//0代表女，1代表男
  `school` VARCHAR(50) NOT NULL,
  `college` VARCHAR(50) NOT NULL,
  `grade` INT NOT NULL,//数字1234
  `tel` VARCHAR(20) NOT NULL,
  `wechat` VARCHAR(50) NULL DEFAULT NULL,
  `like` VARCHAR(50) NOT NULL,
  `join_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `ismatched` INT NOT NULL DEFAULT 0,
  `matched_people` VARCHAR(20) NOT NULL,
  `matched_id` INT NOT NULL DEFAULT -1,
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
  );

```



