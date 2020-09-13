"""empty message

Revision ID: 26183d7c316b
Revises: 1af63fa3cc07
Create Date: 2020-08-09 16:11:21.036152

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '26183d7c316b'
down_revision = '1af63fa3cc07'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('products',
    sa.Column('productid', sa.String(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('imageurl', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('productid')
    )
    op.create_table('users',
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('first_name', sa.String(), nullable=True),
    sa.Column('last_name', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('email')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('users')
    op.drop_table('products')
    # ### end Alembic commands ###