from flask import Flask, render_template
from program import *
app = Flask(__name__)

@app.route('/')
def index():
    return render_template(
                         'index.html',
                         travel_time=travel_time,
                         inspection = inspection,
                         legend = legend,
                         checklist = checklist,
                         report=report,
                         calc_duration=calculate_duration(),
                         audio_duration = audio_duration,
                         find_cache=find_cache,
                         check_duration=check_curator(),
                         salary_data=salary_data,
                         requirement_data = requirement_data,
                         join=join,
                         sum_price_join= sum_price_join
                         )
