"""empty message

Revision ID: 07803a1d09c4
Revises: 
Create Date: 2020-08-09 15:28:17.410217

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '07803a1d09c4'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('products',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('imageurl', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('products')
    # ### end Alembic commands ###
