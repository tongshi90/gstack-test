from fastapi import Response
from openpyxl import Workbook
from io import BytesIO
from typing import List
from app.models.registration import Registration

def export_registrations_to_excel(registrations: List[Registration]) -> Response:
    wb = Workbook()
    ws = wb.active
    ws.title = "报名信息"

    headers = ["报名号", "学生姓名", "性别", "出生日期", "身份证号", "家庭住址", "联系电话",
                "父亲姓名", "父亲电话", "父亲工作单位", "母亲姓名", "母亲电话", "母亲工作单位", "状态", "提交时间"]

    ws.append(headers)

    for reg in registrations:
        student = reg.get_student_info()
        parents = reg.get_parents_info()

        row = [
            reg.registration_number,
            student["name"],
            student["gender"],
            student["birth_date"],
            student["id_card"],
            student["address"],
            student["phone"],
            parents["father"]["name"],
            parents["father"]["phone"],
            parents["father"].get("work_unit", ""),
            parents["mother"]["name"],
            parents["mother"]["phone"],
            parents["mother"].get("work_unit", ""),
            reg.status,
            reg.created_at.strftime("%Y-%m-%d %H:%M:%S") if reg.created_at else ""
        ]
        ws.append(row)

    output = BytesIO()
    wb.save(output)
    output.seek(0)

    return Response(
        content=output.read(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=registrations.xlsx"}
    )
