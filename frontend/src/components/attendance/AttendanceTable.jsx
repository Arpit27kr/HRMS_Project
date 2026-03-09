import { formatDateForDisplay } from '../../utils/formatters';
import './AttendanceTable.css';

function AttendanceTable({ records }) {
  return (
    <article className="attendance-table-card">
      <div className="attendance-table-card__header">
        <h3 className="attendance-table-card__title">Attendance Records</h3>
        <p className="attendance-table-card__count">{records.length} entries</p>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={`${record.attendance_date}-${record.status}-${index}`}>
                <td>{formatDateForDisplay(record.attendance_date)}</td>
                <td>
                  <span
                    className={`status-chip ${
                      record.status === 'Present' ? 'status-chip--present' : 'status-chip--absent'
                    }`.trim()}
                  >
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

export default AttendanceTable;
