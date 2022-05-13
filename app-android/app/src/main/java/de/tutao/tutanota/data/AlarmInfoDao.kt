package de.tutao.tutanota.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import de.tutao.tutanota.alarms.AlarmNotification

@Dao
interface AlarmInfoDao {
	@Insert(onConflict = OnConflictStrategy.REPLACE)
	fun insertAlarmNotification(alarmNotification: AlarmNotification)

	@get:Query("SELECT * FROM AlarmNotification")
	val alarmNotifications: List<AlarmNotification>

	@Query("DELETE FROM AlarmNotification WHERE identifier = :identifier")
	fun deleteAlarmNotification(identifier: String)

	@Query("DELETE FROM AlarmNotification")
	fun clear()
}